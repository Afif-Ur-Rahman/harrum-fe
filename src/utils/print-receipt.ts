import { formatPrice } from ".";

export type PaperWidth = "58mm" | "80mm";

export interface ReceiptData {
  restaurantName: string;
  restaurantAddress?: string;
  logoUrl?: string;
  currency: string;
  orderType?: string;
  orderRef: string;
  tableNo?: number;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  items: { name: string; variant: string; qty: number; price: number }[];
  tip?: number;
  total: number;
  date: string;
  cashier?: string;
  paperWidth?: PaperWidth;
}

export interface KitchenTicketData {
  orderRef: string;
  tableNo?: number;
  orderType?: string;
  customerName?: string;
  deliveryAddress?: string;
  items: { name: string; variant: string; qty: number; note?: string }[];
  instructions?: string;
  date: string;
  paperWidth?: PaperWidth;
  logoUrl?: string;
  restaurantName?: string;
}

const PAGE_CSS = (width: PaperWidth) => `
  @page { size: ${width} auto; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 11px;
    line-height: 1.4;
    width: ${width};
    max-width: ${width};
    margin: 0;
    padding: 3mm 4mm;
    color: #000;
  }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .lg { font-size: 14px; }
  .sm { font-size: 10px; }
  .divider { border-top: 1px dashed #000; margin: 3px 0; }
  .row { display: flex; justify-content: space-between; gap: 4px; }
  .row .name { flex: 1; }
  .row .qty { min-width: 20px; text-align: center; }
  .row .price { min-width: 50px; text-align: right; }
  .mb1 { margin-bottom: 2px; }
  .mb2 { margin-bottom: 5px; }
  .mt2 { margin-top: 5px; }
`;

const printHTML = (html: string) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "0";
  iframe.style.height = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow?.focus();
  // Give browser time to render before printing
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 300);
};

export const printReceipt = (data: ReceiptData) => {
  const width = data.paperWidth ?? "80mm";
  const subtotal = data.items.reduce((s, i) => s + i.price * i.qty, 0);
  const tip = data.tip ?? 0;

  const itemRows = data.items.map((item) => `
    <div class="row mb1">
      <span class="name">${item.name}${item.variant ? ` (${item.variant})` : ""}</span>
      <span class="qty">×${item.qty}</span>
      <span class="price">${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join("");

  const deliveryInfo = (data.orderType === "delivery" || data.orderType === "pickup") ? `
    ${data.customerName ? `<div>${data.customerName}</div>` : ""}
    ${data.customerPhone ? `<div>${data.customerPhone}</div>` : ""}
    ${data.deliveryAddress ? `<div>Addr: ${data.deliveryAddress}</div>` : ""}
    <div class="divider"></div>
  ` : "";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${PAGE_CSS(width)}.header{display:flex;align-items:center;gap:6px;margin-bottom:5px;}.logo{width:40px;height:40px;object-fit:contain;flex-shrink:0;}.header-text{display:flex;flex-direction:column;}</style></head><body>
    <div class="header mb2">
      ${data.logoUrl ? `<img class="logo" src="${data.logoUrl}" alt="logo" />` : ""}
      <div class="header-text">
        <div class="bold lg">${data.restaurantName}</div>
        ${data.restaurantAddress ? `<div class="sm">${data.restaurantAddress}</div>` : ""}
      </div>
    </div>
    <div class="divider"></div>
    <div class="mb2 mt2">
      <div class="row"><span>Date:</span><span>${data.date}</span></div>
      <div class="row"><span>Order:</span><span>${data.orderRef}</span></div>
      ${data.tableNo ? `<div class="row"><span>Table:</span><span>${data.tableNo}</span></div>` : ""}
      ${data.orderType === "delivery" || data.orderType === "pickup" ? `<div class="row"><span>Type:</span><span>Delivery</span></div>` : ""}
      ${data.cashier ? `<div class="row"><span>Cashier:</span><span>${data.cashier}</span></div>` : ""}
    </div>
    ${deliveryInfo}
    <div class="divider"></div>
    <div class="row bold mb1 sm">
      <span class="name">ITEM</span>
      <span class="qty">QTY</span>
      <span class="price">AMT</span>
    </div>
    <div class="divider"></div>
    <div class="mb2">${itemRows}</div>
    <div class="divider"></div>
    <div class="mt2">
      <div class="row"><span>Subtotal</span><span>${formatPrice(subtotal)} ${data.currency}</span></div>
      ${tip > 0 ? `<div class="row"><span>Tip</span><span>${formatPrice(tip)} ${data.currency}</span></div>` : ""}
      <div class="row bold lg mt2"><span>TOTAL</span><span>${formatPrice(data.total)} ${data.currency}</span></div>
    </div>
    <div class="divider"></div>
    <div class="center mt2 sm">Thank you for dining with us!</div>
  </body></html>`;

  printHTML(html);
};

export const printKitchenTicket = (data: KitchenTicketData) => {
  const width = data.paperWidth ?? "80mm";
  const isDelivery = data.orderType === "delivery" || data.orderType === "pickup";

  const itemRows = data.items.map((item) => `
    <div class="mb1">
      <div class="row bold">
        <span class="name">${item.qty}x ${item.name}</span>
        <span class="sm">${item.variant}</span>
      </div>
      ${item.note ? `<div class="sm" style="padding-left:8px">↳ ${item.note}</div>` : ""}
    </div>
  `).join("");

  const headerHtml = (isDelivery && (data.logoUrl || data.restaurantName)) ? `
    <div class="header mb2">
      ${data.logoUrl ? `<img class="logo" src="${data.logoUrl}" alt="logo" />` : ""}
      <div class="header-text">
        ${data.restaurantName ? `<div class="bold lg">${data.restaurantName}</div>` : ""}
      </div>
    </div>` : "";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${PAGE_CSS(width)}.header{display:flex;align-items:center;gap:6px;margin-bottom:5px;}.logo{width:40px;height:40px;object-fit:contain;flex-shrink:0;}.header-text{display:flex;flex-direction:column;}</style></head><body>
    ${headerHtml}
    <div class="center bold lg mb2">*** KITCHEN ***</div>
    <div class="divider"></div>
    <div class="mb2 mt2">
      <div class="row bold">
        <span>${isDelivery ? "DELIVERY" : `TABLE ${data.tableNo}`}</span>
        <span>${data.date}</span>
      </div>
      ${isDelivery && data.customerName ? `<div class="sm">${data.customerName}</div>` : ""}
      ${isDelivery && data.deliveryAddress ? `<div class="sm">Addr: ${data.deliveryAddress}</div>` : ""}
      <div class="row sm"><span>Order:</span><span>${data.orderRef}</span></div>
    </div>
    <div class="divider"></div>
    <div class="mt2 mb2">${itemRows}</div>
    ${data.instructions ? `<div class="divider"></div><div class="mt2 sm"><span class="bold">Note:</span> ${data.instructions}</div>` : ""}
    <div class="divider"></div>
  </body></html>`;

  printHTML(html);
};
