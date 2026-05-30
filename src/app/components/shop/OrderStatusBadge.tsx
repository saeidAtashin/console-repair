import { getShopOrderStatusLabel } from "@/lib/shop-order-status";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending_payment: "bg-amber-500/20 text-amber-300",
  paid: "bg-blue-500/20 text-blue-300",
  processing: "bg-cyan-500/20 text-cyan-300",
  shipped: "bg-purple-500/20 text-purple-300",
  delivered: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-red-500/20 text-red-300",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        statusColors[status] ?? "bg-white/10 text-zinc-300",
      )}
    >
      {getShopOrderStatusLabel(status)}
    </span>
  );
}
