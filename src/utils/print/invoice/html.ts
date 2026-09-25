import { INVOICE_TERMS } from "./constants";
import { InvoiceItemsTable } from "./items";
import { INVOICE_STYLES } from "./styles";
import { InvoiceData } from "./types";

import { CustomerInfo, escapeHtml, getOrigin, Header, money } from "../shared";

const InvoiceFooter = (data: InvoiceData) => `
  <div class="footer">
    <div class="terms">
      <div class="terms-title">
        Term And Conditions;
      </div>

      <div class="terms-list">
        ${INVOICE_TERMS.map(term => `<div>${term}</div>`).join("")}
      </div>
    </div>

    <div class="totals">
      <div class="tbox">
        <span class="lbl">Total =</span>
        <span class="val">${money(data.total)}</span>
      </div>

      <div class="tbox">
        <span class="lbl">Disc = -</span>
        <span class="val">${money(data.discount)}</span>
      </div>

      <div class="tbox">
        <span class="lbl">Final =</span>
        <span class="val">${money(data.final)}</span>
      </div>

      <div class="saleman">
        <span>Sale Man</span>

        ${data.salesman ? `<span class="name">${escapeHtml(data.salesman)}</span>` : ""}
      </div>
    </div>
  </div>
`;

export const InvoiceHtml = (data: InvoiceData) => {
  const origin = getOrigin();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice</title>

  <style>
    ${INVOICE_STYLES}
  </style>
</head>

<body>
  <div class="invoice">
    ${Header(origin)}

    ${CustomerInfo({
      partyType: "Customer",
      partyName: data.customerName,
      phone: data.phone,
      email: data.email,
      date: data.date,
    })}

    ${InvoiceItemsTable(data.items)}

    ${InvoiceFooter(data)}
  </div>
</body>
</html>`;
};
