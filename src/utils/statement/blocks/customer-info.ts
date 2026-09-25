import { escapeHtml, money } from "./helpers";
import type { StatementData } from "../types";

export const CustomerInfo = (data: StatementData) => `
  <div class="customer-box">
    <div class="field">
      <span class="lbl">${data.partyType}</span>
      <span class="val">${escapeHtml(data.partyName)}</span>
    </div>

    <div class="field">
      <span class="lbl">Phone</span>
      <span class="val">${escapeHtml(data.phone)}</span>
    </div>

    ${
      data.email
        ? `
          <div class="field">
            <span class="lbl">Email</span>
            <span class="val">${escapeHtml(data.email)}</span>
          </div>
        `
        : ""
    }

    <div class="field balance">
      <span class="lbl">Remaining Balance</span>
      <span class="val">${money(data.remainingAmount)}</span>
    </div>
  </div>
`;
