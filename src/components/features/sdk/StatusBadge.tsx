/**
 * Transaction status badge.
 * Colour-coded per status — green settled, amber confirmed, blue pending, red failed.
 */

type Status = "pending" | "confirmed" | "settled" | "failed";

const styles: Record<Status, string> = {
  pending:   "bg-blue-50   text-blue-600  border-blue-200",
  confirmed: "bg-amber-50  text-amber-600 border-amber-200",
  settled:   "bg-green-50  text-green-700 border-green-200",
  failed:    "bg-red-50    text-red-600   border-red-200",
};

const dots: Record<Status, string> = {
  pending:   "bg-blue-400 animate-pulse",
  confirmed: "bg-amber-400",
  settled:   "bg-green-500",
  failed:    "bg-red-500",
};

export default function StatusBadge({ status }: { status: string }) {
  const s = (status as Status) in styles ? (status as Status) : "failed";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[s]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[s]}`} />
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}
