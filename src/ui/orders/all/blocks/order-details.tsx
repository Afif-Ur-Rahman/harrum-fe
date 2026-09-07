"use client";

import { Palette } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { formatPrice } from "@/utils";
import { Order } from "@/types";

interface OrderDetailsProps {
  order: Order;
  onClaimItem: (
    orderId: string,
    itemId: string,
    variantId: string,
  ) => Promise<{ state: boolean; message?: string; error?: string }>;
  onReturnItem: (
    orderId: string,
    itemId: string,
    variantId: string,
  ) => Promise<{ state: boolean; message?: string; error?: string }>;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onClaimItem,
  onReturnItem,
}) => {
  return (
    <div className="space-y-4">
      {order.items.map((item) => (
        <div
          key={item._id}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/8 px-4 py-3">
            <Palette className="h-4 w-4 text-cyan-300" />
            <p className="text-sm font-semibold text-white">{item.name}</p>
            <span className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
              {item.priceType}
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {item.variants.map((variant) => (
              <div
                key={variant._id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {variant.color}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {variant.quantity} pcs · {formatPrice(variant.price)} PKR
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {variant.isReturned ? (
                    <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[11px] font-semibold text-red-300 ring-1 ring-inset ring-red-300/30">
                      Returned
                    </span>
                  ) : variant.isClaimed ? (
                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-300/30">
                      Claimed
                    </span>
                  ) : (
                    <>
                      <ConfirmationDialog
                        title="Claim Item"
                        description={`Mark ${variant.color} (${item.name}) as claimed?`}
                        saveButtonTitle="Claim"
                        confirmAction={() =>
                          onClaimItem(order._id, item._id!, variant._id!)
                        }
                        trigger={
                          <button className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/15">
                            Claim
                          </button>
                        }
                      />

                      <ConfirmationDialog
                        title="Return Item"
                        description={`Mark ${variant.color} (${item.name}) as returned? This restores no stock automatically here.`}
                        saveButtonTitle="Return"
                        confirmAction={() =>
                          onReturnItem(order._id, item._id!, variant._id!)
                        }
                        trigger={
                          <button className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-400/15">
                            Return
                          </button>
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
