import { escapeHtml, money } from "./helpers";

import type { StatementBill } from "../types";

export const BillsTable = (bills: StatementBill[]) => {
  if (bills.length === 0) return "";

  const rows = bills
    .map(
      (bill, index) => `
        <tr>
          <td class="idx">${index + 1}</td>
          <td>${escapeHtml(bill.billId)}</td>
          <td>${escapeHtml(bill.date)}</td>
          <td>${bill.note ? escapeHtml(bill.note) : "-"}</td>
          <td class="num">${money(bill.amount)}</td>
        </tr>
      `,
    )
    .join("");

  const total = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return `
    <div class="section">
      <div class="section-title">Bill History</div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="idx">#</th>
            <th>Bill ID</th>
            <th>Date</th>
            <th>Note</th>
            <th class="num">Amount</th>
          </tr>
        </thead>

        <tbody>
          ${rows}

          <tr class="total-row">
            <td colspan="4" class="label">Total Billed</td>
            <td class="num total">${money(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};
