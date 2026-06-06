"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateWalletAddress } from "@/services/stablecoin";

const transferSchema = z.object({
  toAddress:   z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid wallet address"),
  amount:      z.coerce.number().positive("Amount must be greater than 0"),
  asset:       z.enum(["USDC", "USDT", "EURC", "PYUSD"]),
  network:     z.enum(["ethereum", "polygon", "solana"]),
  fee:         z.coerce.number().nonnegative(),
  routeId:     z.string(),
});

/**
 * Connects a wallet address to the organization.
 * Generates a mock address in sandbox mode.
 * Returns the new wallet address on success, or an error string.
 */
export async function connectWalletAction(): Promise<{ address: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return { error: "No organization found" };

  const address = generateWalletAddress();

  await db.organization.update({
    where: { id: membership.organizationId },
    data: { walletAddress: address },
  });

  revalidatePath("/dashboard/sdk");
  return { address };
}

/**
 * Creates a new pending transaction and deducts the amount from the org balance.
 * Returns the created transaction ID on success, or an error string.
 */
export async function createTransactionAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ txId: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const raw = {
    toAddress: formData.get("toAddress"),
    amount:    formData.get("amount"),
    asset:     formData.get("asset"),
    network:   formData.get("network"),
    fee:       formData.get("fee"),
    routeId:   formData.get("routeId"),
  };

  const parsed = transferSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { toAddress, amount, asset, network, fee, routeId } = parsed.data;

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });
  if (!membership) return { error: "No organization found" };

  const org = membership.organization;

  if (!org.walletAddress) return { error: "Connect a wallet first" };
  if (org.balance < amount + fee) return { error: "Insufficient balance" };

  const tx = await db.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        organizationId: org.id,
        fromAddress: org.walletAddress!,
        toAddress,
        amount,
        asset,
        network,
        fee,
        routeId,
        status: "pending",
        txHash: `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")}`,
      },
    });

    // Deduct from sandbox balance
    await tx.organization.update({
      where: { id: org.id },
      data: { balance: { decrement: amount + fee } },
    });

    return transaction;
  });

  revalidatePath("/dashboard/sdk");
  revalidatePath("/dashboard");
  return { txId: tx.id };
}

/**
 * Advances a transaction through the status lifecycle.
 * Called by the client on a timer to simulate on-chain confirmation.
 */
export async function advanceTransactionStatusAction(txId: string): Promise<void> {
  const current = await db.transaction.findUnique({ where: { id: txId } });
  if (!current) return;

  const next =
    current.status === "pending"   ? "confirmed" :
    current.status === "confirmed" ? "settled"   : null;

  if (!next) return;

  await db.transaction.update({ where: { id: txId }, data: { status: next } });
  revalidatePath("/dashboard/sdk");
  revalidatePath("/dashboard");
}
