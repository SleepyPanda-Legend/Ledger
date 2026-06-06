"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** Revalidates all paths that display alert data. */
function revalidateAlerts() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/alerts");
}

/**
 * Marks a single alert as read.
 * No-ops gracefully if the alert doesn't belong to the current org.
 */
export async function markAlertReadAction(alertId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return;

  await db.alert.updateMany({
    where: { id: alertId, organizationId: membership.organizationId },
    data: { read: true },
  });

  revalidateAlerts();
}

/**
 * Dismisses (deletes) a single alert.
 */
export async function dismissAlertAction(alertId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return;

  await db.alert.deleteMany({
    where: { id: alertId, organizationId: membership.organizationId },
  });

  revalidateAlerts();
}

/**
 * Marks all alerts as read for the current organization.
 */
export async function markAllReadAction(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return;

  await db.alert.updateMany({
    where: { organizationId: membership.organizationId, read: false },
    data: { read: true },
  });

  revalidateAlerts();
}

/**
 * Deletes all alerts for the current organization (clear all).
 */
export async function clearAllAlertsAction(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return;

  await db.alert.deleteMany({
    where: { organizationId: membership.organizationId },
  });

  revalidateAlerts();
}

const alertConfigSchema = z.object({
  type: z.enum(["rate_threshold", "volatility_spike"]),
  asset: z.string().min(1),
  threshold: z.coerce.number().optional(),
  enabled: z.boolean(),
});

/**
 * Upserts a single alert configuration for the current org.
 * Uses the (orgId, type, asset) unique constraint to prevent duplicates.
 */
export async function saveAlertConfigAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return { success: false, error: "No organization found" };

  const raw = {
    type: formData.get("type"),
    asset: formData.get("asset"),
    threshold: formData.get("threshold") ?? undefined,
    enabled: formData.get("enabled") === "true",
  };

  const parsed = alertConfigSchema.safeParse(raw);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message };

  const { type, asset, threshold, enabled } = parsed.data;

  await db.alertConfig.upsert({
    where: {
      organizationId_type_asset: {
        organizationId: membership.organizationId,
        type,
        asset,
      },
    },
    update: { threshold, enabled },
    create: {
      organizationId: membership.organizationId,
      type,
      asset,
      threshold,
      enabled,
    },
  });

  revalidatePath("/dashboard/alerts");
  return { success: true };
}

/**
 * Seeds demo alerts for a new organization so the notification center isn't empty.
 * Idempotent — checks if any alerts already exist before inserting.
 */
export async function seedDemoAlertsAction(orgId: string): Promise<void> {
  const existing = await db.alert.count({ where: { organizationId: orgId } });
  if (existing > 0) return;

  const demos = [
    {
      type: "volatility_spike",
      asset: "USDC/GBP",
      message:
        "USDC/GBP volatility spiked above threshold — consider delaying GBP conversions.",
    },
    {
      type: "rate_threshold",
      asset: "USDC/EUR",
      message: "USDC/EUR dropped below 0.92. Your configured alert threshold was crossed.",
    },
    {
      type: "tx_confirmed",
      asset: "USDC",
      message: "Transaction settled: 500 USDC sent via Solana (0 ms settlement).",
      read: true,
    },
  ];

  await db.alert.createMany({
    data: demos.map((d) => ({ organizationId: orgId, ...d })),
  });
}

/**
 * Creates a "transaction confirmed" alert when a transaction settles.
 * Called from advanceTransactionStatusAction on final settlement.
 */
export async function createTxConfirmedAlertAction(
  orgId: string,
  amount: number,
  asset: string,
  network: string,
): Promise<void> {
  await db.alert.create({
    data: {
      organizationId: orgId,
      type: "tx_confirmed",
      asset,
      message: `Transaction settled: ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${asset} sent via ${network}.`,
    },
  });
  revalidateAlerts();
}
