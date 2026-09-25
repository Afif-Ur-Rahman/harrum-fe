import { Order } from "@/types";

import { InvoiceItem } from "./types";

import { escapeHtml, money } from "../shared";

const normalizeQuantity = (quantity: number, size?: string) => {
  return `${quantity} ${size ?? ""}`.trim();
};

export const InvoiceItems = (items: Order["items"]): InvoiceItem[] =>
  items.flatMap(item => {
    if (item.variants?.length > 0) {
      return item.variants.map(variant => {
        const quantity = Number(variant.quantity) || 0;
        const amount = Number(variant.price) || 0;

        return {
          name: `${item.name} (${variant.color})`,
          quantity: normalizeQuantity(quantity, item.size),
          rate: quantity ? amount / quantity : 0,
          amount,
        };
      });
    }

    const quantity = Number(item.quantity) || 0;
    const amount = Number(item.price) || 0;

    return [
      {
        name: item.name,
        quantity: normalizeQuantity(quantity, item.size),
        rate: quantity ? amount / quantity : 0,
        amount,
      },
    ];
  });

export const InvoiceItemsTable = (items: InvoiceItem[]) => {
  if (items.length === 0) return "";

  const rows = items
    .map(
      (item, index) => `
        <tr>
          <td class="idx">
            ${index + 1}
          </td>

          <td>
            ${escapeHtml(item.name)}

            ${item.detail ? `<div class="item-detail">${escapeHtml(item.detail)}</div>` : ""}
          </td>

          <td>
            ${escapeHtml(item.quantity)}
          </td>

          <td class="num">
            ${money(item.rate)}
          </td>

          <td class="num">
            ${money(item.amount)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <div class="section invoice-items">
      <div class="section-title">Items</div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="idx">#</th>
            <th>Detail</th>
            <th>Qty</th>
            <th class="num">U/R</th>
            <th class="num">Amount</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};

export const calculateInvoiceItemsTotal = (items: InvoiceItem[]) =>
  items.reduce((sum, item) => sum + item.amount, 0);
