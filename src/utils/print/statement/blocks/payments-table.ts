import type { StatementPayment } from "../types";

import { escapeHtml, money } from "../../shared";

export const PaymentsTable = (payments: StatementPayment[]) => {
  if (payments.length === 0) return "";

  const rows = payments
    .map(
      (payment, index) => `
        <tr>
          <td class="idx">${index + 1}</td>
          <td>${escapeHtml(payment.date)}</td>
          <td class="cap">${escapeHtml(payment.method)}</td>
          <td>${payment.note ? escapeHtml(payment.note) : "-"}</td>
          <td class="num">${money(payment.amount)}</td>
        </tr>
      `,
    )
    .join("");

  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return `
    <div class="section">
      <div class="section-title">Payment History</div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="idx">#</th>
            <th>Date</th>
            <th>Method</th>
            <th>Note</th>
            <th class="num">Amount</th>
          </tr>
        </thead>

        <tbody>
          ${rows}

          <tr class="total-row">
            <td colspan="4" class="label">Total Paid</td>
            <td class="num total">${money(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};
