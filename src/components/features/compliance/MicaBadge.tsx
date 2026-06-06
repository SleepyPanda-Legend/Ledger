import { Globe, CheckCircle, Loader, Circle } from "lucide-react";
import type { MicaStatus } from "@/lib/utils/compliance-mock";

interface MicaBadgeProps {
  status: MicaStatus;
}

const CONFIG: Record<
  MicaStatus,
  {
    label: string;
    sublabel: string;
    description: string;
    checklist: { item: string; done: boolean }[];
    icon: typeof CheckCircle;
    iconClass: string;
    badgeClass: string;
  }
> = {
  ready: {
    label: "MiCA Ready",
    sublabel: "EU Markets in Crypto-Assets Regulation",
    description:
      "Your organisation meets all MiCA requirements for operating in the European Economic Area.",
    checklist: [
      { item: "CASP authorisation obtained", done: true },
      { item: "Reserve asset disclosure filed", done: true },
      { item: "Travel Rule implementation confirmed", done: true },
      { item: "White-paper published", done: true },
    ],
    icon: CheckCircle,
    iconClass: "text-success",
    badgeClass:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/40",
  },
  in_progress: {
    label: "MiCA In Progress",
    sublabel: "EU Markets in Crypto-Assets Regulation",
    description:
      "MiCA compliance assessment is underway. Complete the outstanding items to qualify for EU market access.",
    checklist: [
      { item: "CASP authorisation application submitted", done: true },
      { item: "Reserve asset disclosure filed", done: false },
      { item: "Travel Rule implementation confirmed", done: false },
      { item: "White-paper published", done: false },
    ],
    icon: Loader,
    iconClass: "text-warning",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40",
  },
  not_started: {
    label: "MiCA Not Started",
    sublabel: "EU Markets in Crypto-Assets Regulation",
    description:
      "MiCA compliance has not been initiated. Required to operate stablecoin services in the European Economic Area.",
    checklist: [
      { item: "CASP authorisation application submitted", done: false },
      { item: "Reserve asset disclosure filed", done: false },
      { item: "Travel Rule implementation confirmed", done: false },
      { item: "White-paper published", done: false },
    ],
    icon: Circle,
    iconClass: "text-subtle",
    badgeClass:
      "bg-gray-50 text-gray-600 border-gray-200 dark:bg-neutral-800 dark:text-gray-400 dark:border-white/10",
  },
};

/**
 * MiCA readiness card — EU regulatory compliance indicator.
 * Shows a checklist of the four key MiCA requirements with completion state.
 */
export default function MicaBadge({ status }: MicaBadgeProps) {
  const { label, sublabel, description, checklist, icon: Icon, iconClass, badgeClass } =
    CONFIG[status];

  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 dark:border-white/5">
        <Globe size={15} className="text-accent" />
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted">{sublabel}</p>
        </div>
        <span
          className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          {doneCount}/{checklist.length} items
        </span>
      </div>

      {/* Description */}
      <div className="px-5 pt-4">
        <div className="flex items-start gap-3">
          <Icon size={16} className={`mt-0.5 shrink-0 ${iconClass}`} />
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>

      {/* Checklist */}
      <ul className="flex flex-col gap-2 px-5 py-4">
        {checklist.map(({ item, done }) => (
          <li key={item} className="flex items-center gap-2.5">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                done
                  ? "bg-success/10 text-success"
                  : "bg-gray-100 text-subtle dark:bg-neutral-700"
              }`}
            >
              {done ? (
                <CheckCircle size={11} />
              ) : (
                <Circle size={11} />
              )}
            </span>
            <span
              className={`text-xs ${done ? "text-foreground" : "text-muted"}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
