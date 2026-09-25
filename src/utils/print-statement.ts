import { formatPrice } from "./price-format";

export interface StatementPayment {
  date: string;
  amount: number;
  method: string;
  note?: string;
}

export interface StatementOrderItem {
  name: string;
  quantity: string;
}

export interface StatementOrder {
  orderId: string;
  date: string;
  items: StatementOrderItem[];
  discount: number;
  total: number;
  isPaid: boolean;
}

export interface StatementData {
  customerName: string;
  phone: string;
  email?: string;
  remainingAmount: number;
  payments: StatementPayment[];
  orders: StatementOrder[];
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const money = (value: number) => `${formatPrice(value)}/-`;

const HANDSET_PATH =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";

const ICONS = {
  phone: `<svg viewBox="0 0 24 24" width="26" height="26"><rect width="24" height="24" rx="5" fill="#4caf50"/><g transform="translate(4 4) scale(0.66)"><path d="${HANDSET_PATH}" fill="#fff"/></g></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" width="26" height="26"><rect width="24" height="24" rx="5" fill="#25d366"/><path d="M12 4a8 8 0 0 0-6.9 12L4 20l4.1-1.1A8 8 0 1 0 12 4z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><g transform="translate(7.3 7.3) scale(0.4)"><path d="${HANDSET_PATH}" fill="#fff"/></g></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="26" height="26"><rect width="24" height="24" rx="5" fill="#1877f2"/><path d="M13.5 20v-6.5h2.3l.4-2.7h-2.7V9.2c0-.8.3-1.3 1.4-1.3h1.4V5.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.4 1.3-3.4 3.500v1.800H8.500v2.700h2.300V20h2.700z" fill="#fff"/></svg>`,
  gmail: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 19V7l9 7 9-7v12" fill="none" stroke="#d93025" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
};

const buildPaymentsTable = (payments: StatementPayment[]) => {
  if (payments.length === 0) return "";

  const rows = payments
    .map(
      (p, i) => `
      <tr>
        <td class="idx">${i + 1}</td>
        <td>${escapeHtml(p.date)}</td>
        <td class="cap">${escapeHtml(p.method)}</td>
        <td>${p.note ? escapeHtml(p.note) : "-"}</td>
        <td class="num">${money(p.amount)}</td>
      </tr>`,
    )
    .join("");

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  const totalRow = `
      <tr class="total-row">
        <td colspan="4" class="label">Total Paid</td>
        <td class="num total">${money(total)}</td>
      </tr>`;

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
        <tbody>${rows}${totalRow}</tbody>
      </table>
    </div>`;
};

const buildOrdersTable = (orders: StatementOrder[]) => {
  if (orders.length === 0) return "";

  const rows = orders
    .map((o, i) => {
      const itemsList = o.items.map(item => `${item.name} (${item.quantity})`).join(", ");

      return `
      <tr>
        <td class="idx">${i + 1}</td>
        <td>${escapeHtml(o.orderId.slice(-6).toUpperCase())}</td>
        <td>${escapeHtml(o.date)}</td>
        <td class="items">${escapeHtml(itemsList)}</td>
        <td class="num">${money(o.discount)}</td>
        <td class="cap">${o.isPaid ? "Paid" : "Unpaid"}</td>
        <td class="num">${money(o.total)}</td>
      </tr>`;
    })
    .join("");

  const total = orders.reduce((sum, o) => sum + o.total, 0);

  const totalRow = `
      <tr class="total-row">
        <td colspan="6" class="label">Total Ordered</td>
        <td class="num total">${money(total)}</td>
      </tr>`;

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
        <tbody>${rows}${totalRow}</tbody>
      </table>
    </div>`;
};

const buildHtml = (data: StatementData) => {
  const generatedOn = new Date().toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Account Statement - ${escapeHtml(data.customerName)}</title>
<style>
  @page { size: A4; margin: 6mm 12mm 14mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #fff; font-family: Arial, Helvetica, sans-serif; color: #111; }

  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ed1c24; padding-bottom: 12px; }  .logo img { height: auto; width: 200px; display: block; }
  .contacts {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 6px 20px;
    align-items: center;
    justify-content: end;
  }
  .contact { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; white-space: nowrap; }
  .contact svg { flex-shrink: 0; }

  .title-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 18px; }
  .doc-title { color: #ed1c24; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
  .generated { font-size: 10px; color: #777; }

  .customer-box {
    margin-top: 14px; border: 1px solid #ccc; border-radius: 6px; padding: 12px 16px;
    display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: #fafafa;
  }
  .customer-box .field { font-size: 12.5px; }
  .customer-box .field .lbl { color: #777; font-weight: 600; text-transform: uppercase; font-size: 9.5px; letter-spacing: 0.4px; display: block; }
  .customer-box .field .val { font-weight: 700; margin-top: 2px; }
  .customer-box .balance .val { color: ${data.remainingAmount > 0 ? "#c0392b" : "#1e8449"}; }

  .section { margin-top: 22px; }
  .section-title {
    font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;
    color: #fff; background: #a487ad; padding: 6px 10px; border-radius: 4px 4px 0 0;
  }

  table.data-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  table.data-table th {
    background: #f1eef3; text-align: left; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.3px; padding: 6px 8px; border-bottom: 2px solid #ddd; color: #555;
  }
  table.data-table td { padding: 6px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  table.data-table tr:last-child td { border-bottom: 1px solid #ddd; }
  table.data-table .idx { width: 24px; color: #999; }
  table.data-table .num { text-align: right; white-space: nowrap; font-weight: 600; }
  table.data-table .cap { text-transform: capitalize; }
  table.data-table .items { max-width: 260px; }
  table.data-table .total-row td { border-top: 2px solid #333; border-bottom: none; padding-top: 8px; }
  table.data-table .total-row .label { text-align: right; font-weight: 700; font-size: 11px; }
  table.data-table .total-row .total { font-size: 13px; color: #ed1c24; }

  .no-data { margin-top: 22px; text-align: center; color: #999; font-size: 12px; border: 1px dashed #ddd; border-radius: 6px; padding: 18px; }

  .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; text-align: center; font-size: 10px; color: #999; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo"><img src="${origin}/app-logo.png" alt="Harrum Cloth House" /></div>
    <div class="contacts">
      <div class="contact">${ICONS.phone}<span>0333-9072225</span></div>
      <div class="contact">${ICONS.whatsapp}<span>0333-9072225</span></div>
      <div class="contact">${ICONS.facebook}<span>/Harrumclothhouse</span></div>
      <div class="contact">${ICONS.gmail}<span>Harrumcloth@gmail.com</span></div>
    </div>
  </div>

  <div class="title-row">
    <div class="doc-title">ACCOUNT STATEMENT</div>
    <div class="generated">Generated: ${generatedOn}</div>
  </div>

  <div class="customer-box">
    <div class="field">
      <span class="lbl">Customer</span>
      <span class="val">${escapeHtml(data.customerName)}</span>
    </div>
    <div class="field">
      <span class="lbl">Phone</span>
      <span class="val">${escapeHtml(data.phone)}</span>
    </div>
    ${
      data.email
        ? `<div class="field"><span class="lbl">Email</span><span class="val">${escapeHtml(data.email)}</span></div>`
        : ""
    }
    <div class="field balance">
      <span class="lbl">Remaining Balance</span>
      <span class="val">${money(data.remainingAmount)}</span>
    </div>
  </div>

  ${buildPaymentsTable(data.payments)}
  ${buildOrdersTable(data.orders)}

  ${
    data.payments.length === 0 && data.orders.length === 0
      ? `<div class="no-data">No payments or orders found for this customer.</div>`
      : ""
  }

  <div class="footer">Harrum Cloth House — Account Statement</div>
</body>
</html>`;
};

export const printStatement = async (data: StatementData) => {
  if (typeof window === "undefined") return;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(buildHtml(data));
  doc.close();

  const images = Array.from(doc.images);
  await Promise.race([
    Promise.all(
      images.map(
        img =>
          new Promise<void>(resolve => {
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    ),
    new Promise<void>(resolve => setTimeout(resolve, 2000)),
  ]);

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  setTimeout(() => {
    if (iframe.parentNode) document.body.removeChild(iframe);
  }, 1000);
};
