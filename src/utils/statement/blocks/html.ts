import { BillsTable } from "./bills-table";
import { CustomerInfo } from "./customer-info";
import { Header } from "./header";
import { StatementFileName, getOrigin } from "./helpers";
import { OrdersTable } from "./orders-table";
import { PaymentsTable } from "./payments-table";
import { STATEMENT_STYLES } from "./styles";
import type { StatementData } from "../types";

export const Html = (data: StatementData) => {
  const now = new Date();

  const generatedOn = now.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const fileName = StatementFileName(data.partyName, now);

  const secondaryHtml =
    data.partyType === "Vendor" ? BillsTable(data.bills ?? []) : OrdersTable(data.orders ?? []);

  const hasSecondary =
    data.partyType === "Vendor" ? (data.bills?.length ?? 0) > 0 : (data.orders?.length ?? 0) > 0;

  const noData =
    data.payments.length === 0 && !hasSecondary
      ? `
        <div class="no-data">
          No payments or ${
            data.partyType === "Vendor" ? "bills" : "orders"
          } found for this ${data.partyType.toLowerCase()}.
        </div>
      `
      : "";

  const balanceColor = data.remainingAmount > 0 ? "#c0392b" : "#1e8449";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />

  <title>${fileName}</title>

  <style>
    :root {
      --balance-color: ${balanceColor};
    }

    ${STATEMENT_STYLES}
  </style>
</head>

<body>
  ${Header(getOrigin())}

  <div class="title-row">
    <div class="doc-title">ACCOUNT STATEMENT</div>

    <div class="generated">
      Generated: ${generatedOn}
    </div>
  </div>

  ${CustomerInfo(data)}

  ${PaymentsTable(data.payments)}

  ${secondaryHtml}

  ${noData}

  <div class="footer">
    Harrum Cloth House — Account Statement
  </div>
</body>
</html>`;
};
