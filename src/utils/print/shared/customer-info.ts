import { escapeHtml, money } from "./helpers";
import { CustomerData } from "./types";

export const CustomerInfo = (data: CustomerData) => `
  <div class="customer-box">
    <div class="field">
      <span class="lbl">${data.partyType}</span>
      <span class="val">${escapeHtml(data.partyName)}</span>
    </div>

    <div class="field">
      <span class="lbl">Phone</span>
      <span class="val">${escapeHtml(data.phone)}</span>
    </div>

    <div class="field">
      <span class="lbl">Email</span>
      <span class="val">${escapeHtml(data.email)}</span>
    </div>

    ${
      data.remainingAmount != null
        ? `<div class="field balance">
            <span class="lbl">Remaining Balance</span>
            <span class="val">${money(data.remainingAmount)}</span>
          </div>`
        : ""
    }

    ${
      data.date
        ? `<div class="field">
            <span class="lbl">Date</span>
            <span class="val">${escapeHtml(data.date)}</span>
          </div>`
        : ""
    }
  </div>
`;
