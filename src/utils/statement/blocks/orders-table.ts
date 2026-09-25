import { escapeHtml, money } from "./helpers";
import type { StatementOrder } from "../types";

export const OrdersTable = (orders: StatementOrder[]) => {
  if (orders.length === 0) return "";

  const rows = orders
    .map((order, index) => {
      const itemsList = order.items.map(item => `${item.name} (${item.quantity})`).join(", ");

      return `
        <tr>
          <td class="idx">${index + 1}</td>

          <td>
            ${escapeHtml(order.orderId.slice(-6).toUpperCase())}
          </td>

          <td>${escapeHtml(order.date)}</td>

          <td class="items">
            ${escapeHtml(itemsList)}
          </td>

          <td class="num">${money(order.discount)}</td>

          <td class="cap">
            ${order.isPaid ? "Paid" : "Unpaid"}
          </td>

          <td class="num">${money(order.total)}</td>
        </tr>
      `;
    })
    .join("");

  const total = orders.reduce((sum, order) => sum + order.total, 0);

  return `
    <div class="section">
      <div class="section-title">Order History</div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="idx">#</th>
            <th>Order #</th>
            <th>Date</th>
            <th>Items</th>
            <th class="num">Discount</th>
            <th>Status</th>
            <th class="num">Total</th>
          </tr>
        </thead>

        <tbody>
          ${rows}

          <tr class="total-row">
            <td colspan="6" class="label">
              Total Ordered
            </td>

            <td class="num total">
              ${money(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};
