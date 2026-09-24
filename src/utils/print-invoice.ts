import { Order } from "@/types";

import { formatPrice } from "./price-format";

export interface InvoiceItem {
  name: string;
  detail?: string;
  quantity: string;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  customerName: string;
  orderId: string;
  phone: string;
  date: Date;
  items: InvoiceItem[];
  total: number;
  discount: number;
  final: number;
  salesman?: string;
}

const TERMS = [
  "01. Return, change & claim only with Invoice.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Without Invoice no return, no exchange, no claim",
  "02. Always shrink before stitching.",
  "03. No claim below Rs. 2000.",
  "04. No return even change on shrinked suit.",
  "05. Claim is only for color faint or lint.",
  "06. Demand claim within six months.",
  "07. Out cutting will not be return or exchange.",
];

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const normalizePhone = (phone: string) => {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length === 12) digits = `0${digits.slice(2)}`;
  return digits;
};

const box = (char = "") => `<span class="pbox">${escapeHtml(char)}</span>`;

const buildPhoneBoxes = (phone: string) => {
  const digits = normalizePhone(phone);
  const first = Array.from({ length: 4 }, (_, i) => box(digits[i] ?? "")).join("");
  const second = Array.from({ length: 7 }, (_, i) => box(digits[i + 4] ?? "")).join("");
  return `${first}<span class="pdash">-</span>${second}`;
};

const money = (value: number) => `${formatPrice(value)}/-`;

const buildRows = (items: InvoiceItem[]) =>
  items
    .map(
      (item, index) => `
      <div class="row">
        <div class="sr">${String(index + 1).padStart(2, "0")}</div>
        <div class="detail">
          ${escapeHtml(item.name)}
        </div>
        <div class="num qty">${escapeHtml(item.quantity)}</div>
        <div class="num">${money(item.rate)}</div>
        <div class="num">${money(item.amount)}</div>
      </div>`,
    )
    .join("");

const HANDSET_PATH =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";

const ICONS = {
  phone: `<svg viewBox="0 0 24 24" width="32" height="32"><rect width="24" height="24" rx="5" fill="#4caf50"/><g transform="translate(4 4) scale(0.66)"><path d="${HANDSET_PATH}" fill="#fff"/></g></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" width="32" height="32"><rect width="24" height="24" rx="5" fill="#25d366"/><path d="M12 4a8 8 0 0 0-6.9 12L4 20l4.1-1.1A8 8 0 1 0 12 4z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><g transform="translate(7.3 7.3) scale(0.4)"><path d="${HANDSET_PATH}" fill="#fff"/></g></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="32" height="32"><rect width="24" height="24" rx="5" fill="#1877f2"/><path d="M13.5 20v-6.5h2.3l.4-2.7h-2.7V9.2c0-.8.3-1.3 1.4-1.3h1.4V5.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.4 1.3-3.4 3.500v1.800H8.500v2.700h2.300V20h2.700z" fill="#fff"/></svg>`,
  gmail: `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M3 19V7l9 7 9-7v12" fill="none" stroke="#d93025" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
};

const buildHtml = (data: InvoiceData) => {
  const { date } = data;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice</title>
<style>
    @page { margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #fff; font-family: Arial, Helvetica, sans-serif; }

  /* Designed at 1210px wide, scaled to fit 210mm (~794px) when printing */
  .invoice {
    width: 1210px;
    border: 2px solid #9a9a9a;
    padding: 30px 30px 20px;
    position: relative;
    background: #fff;
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; }
  .brand { position: relative; width: 720px; }
  .brand-name {
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 900;
    font-size: 130px;
    line-height: 1;
    letter-spacing: 2px;
    color: #ed1c24;
    -webkit-text-stroke: 7px #111;
    paint-order: stroke fill;
    margin: 0;
  }
  .dear {
    position: absolute; left: 12px; top: 138px;
    color: #e6007e; font-weight: 700; font-style: italic; font-size: 32px;
  }
  .cloth-house {
    position: absolute; right: 0; top: 118px;
    font-family: Georgia, "Times New Roman", serif;
    color: #ed1c24; font-size: 56px; line-height: 1; white-space: pre;
  }
  .right-head { width: 450px; }
  .contact-row { display: flex; gap: 24px; align-items: flex-start; }
  .contacts { display: flex; flex-direction: column; gap: 4px; }
  .contact { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 26px; line-height: 1.15; white-space: nowrap; }
  .contact.small { font-size: 19px; }
  .contact svg { flex-shrink: 0; }
  .logo { margin-top: -6px; flex-shrink: 0; }
  .logo img { height: 132px; width: auto; display: block; }
  .invoice-title { color: #ed1c24; font-size: 66px; font-weight: 700; text-align: right; margin-top: 20px; }

  /* Line + serial */
  .line-row {
    position: relative;
    margin-top: 4px;
    height: 44px;
    border-bottom: 2px solid #222;
  }
  .line-row .customer {
    position: absolute; left: 10px; bottom: 4px;
    font-style: italic; font-weight: 700; font-size: 28px; line-height: 1.2;
    max-width: 660px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .line-row .sr-label {
    position: absolute; left: 715px; bottom: 4px;
    font-style: italic; font-weight: 700; font-size: 28px; line-height: 1.2;
  }
  .line-row .sr-label .sr-id { margin-left: 8px; text-transform: uppercase; }

  /* Phone + date */
  .meta { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px; }
  .phone { display: flex; align-items: center; }
  .phone .label { font-style: italic; font-weight: 700; font-size: 44px; margin-right: 4px; }
  .pbox {
    width: 48px; height: 48px; border: 2px solid #222; border-right-width: 0;
    display: inline-flex; align-items: center; justify-content: center;
    font-style: italic; font-weight: 700; font-size: 38px;
  }
  .pbox:last-child { border-right-width: 2px; }
  .pdash {
    width: 48px; height: 48px; border: 2px solid #222; border-right-width: 0;
    display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 40px;
  }
  .pdash + .pbox { border-left-width: 2px; }
  .dates { display: flex; gap: 60px; font-style: italic; font-weight: 700; font-size: 28px; }
  .dates .col { display: flex; flex-direction: column; align-items: center; }
  .dbox {
    min-width: 84px; height: 36px; border: 2px solid #222; margin-top: 4px;
    display: flex; align-items: center; justify-content: center;
    font-style: italic; font-weight: 700; font-size: 26px; padding: 0 6px;
  }

  /* Table */
  .cols { display: grid; grid-template-columns: 145px 1fr 190px 140px 200px; gap: 8px; }
  .thead { margin-top: 26px; }
  .th {
    background: #a487ad; color: #fff; font-weight: 700; font-size: 34px; height: 68px;
    display: flex; align-items: center; justify-content: center;
    clip-path: polygon(6% 0, 100% 0, 94% 100%, 0 100%);
  }
  .row { display: grid; grid-template-columns: 145px 1fr 190px 140px 200px; gap: 8px; min-height: 74px; align-items: center; }
  .sr { font-style: italic; font-weight: 900; font-size: 40px; padding-left: 30px; }
  .detail { font-style: italic; font-weight: 700; font-size: 28px; padding: 6px 4px; }
  .detail .sub { font-size: 20px; font-weight: 600; color: #444; margin-top: 2px; }
  .num { font-style: italic; font-weight: 900; font-size: 36px; text-align: right; padding-right: 8px; }
  .num.qty { font-size: 30px; white-space: nowrap; }

  /* Footer */
  .footer { display: flex; justify-content: space-between; margin-top: 10px; align-items: flex-start; }
  .terms { width: 620px; }
  .terms-title {
    display: inline-block; background: #ed1c24; color: #fff; border-radius: 10px;
    font-style: italic; font-weight: 700; font-size: 40px; padding: 2px 18px;
  }
  .terms-list { margin-top: 10px; color: #e6007e; font-style: italic; font-weight: 700; font-size: 17px; line-height: 1.5; }
  .totals { width: 410px; }
  .tbox {
    border: 2px solid #222; outline: 2px solid #fff; height: 52px; margin-bottom: 8px;
    display: flex; align-items: center; justify-content: space-between; padding: 0 8px;
    font-style: italic; font-weight: 700; font-size: 38px;
  }
  .tbox .lbl { color: #00aeef; }
  .tbox .val { color: #111; font-size: 34px; }
  .saleman { margin-top: 20px; margin-left: 14px; color: #00aeef; font-style: italic; font-weight: 700; font-size: 40px; }
  .saleman .name { color: #111; font-size: 26px; margin-left: 14px; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="brand">
      <h1 class="brand-name">HARRUM</h1>
      <div class="dear">Dear Sir/Madam</div>
      <div class="cloth-house">Cloth    House</div>
    </div>
    <div class="right-head">
      <div class="contact-row">
          <div class="contacts">
            <div class="contact">${ICONS.phone}<span>0333-9072225</span></div>
            <div class="contact">${ICONS.whatsapp}<span>0333-9072225</span></div>
            <div class="contact small">${ICONS.facebook}<span>/Harrumclothhouse</span></div>
            <div class="contact small">${ICONS.gmail}<span>Harrumcloth@gmail.com</span></div>
          </div>
          <div class="logo"><img src="${origin}/images/invoice-logo.png" alt="Harrum Cloth House" /></div>
      </div>
        <div class="invoice-title">INVOICE</div>
    </div>
  </div>

  <div class="line-row">
    <div class="customer">${escapeHtml(data.customerName)}</div>
    <div class="sr-label">Sr.#<span class="sr-id">${escapeHtml(data.orderId.slice(-6))}</span></div>
  </div>

  <div class="meta">
    <div class="phone"><span class="label">PH#.</span>${buildPhoneBoxes(data.phone)}</div>
    <div class="dates">
      <div class="col">Days<div class="dbox">${String(date.getDate()).padStart(2, "0")}</div></div>
      <div class="col">Month<div class="dbox">${String(date.getMonth() + 1).padStart(2, "0")}</div></div>
      <div class="col">Year<div class="dbox">${date.getFullYear()}</div></div>
    </div>
  </div>

  <div class="cols thead">
    <div class="th">S.R</div>
    <div class="th">DETAIL</div>
    <div class="th">QTY</div>
    <div class="th">U/R</div>
    <div class="th">AMOUNT</div>
  </div>

  ${buildRows(data.items)}

  <div class="footer">
    <div class="terms">
      <div class="terms-title">Term And Conditions;</div>
      <div class="terms-list">${TERMS.map(t => `<div>${t}</div>`).join("")}</div>
    </div>
    <div class="totals">
      <div class="tbox"><span class="lbl">Total =</span><span class="val">${money(data.total)}</span></div>
      <div class="tbox"><span class="lbl">Disc = -</span><span class="val">${money(data.discount)}</span></div>
      <div class="tbox"><span class="lbl">Final =</span><span class="val">${money(data.final)}</span></div>
      <div class="saleman">Sale Man${
        data.salesman ? `<span class="name">${escapeHtml(data.salesman)}</span>` : ""
      }</div>
    </div>
  </div>
</div>
</body>
</html>`;
};

export const printInvoice = async (data: InvoiceData) => {
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

  const invoice = doc.querySelector<HTMLElement>(".invoice");
  if (invoice) {
    const heightMm = Math.ceil(invoice.offsetHeight * (210 / 1210)) + 1;

    const pageStyle = doc.createElement("style");
    pageStyle.textContent = `@page { size: 210mm ${heightMm}mm; margin: 0; }`;
    doc.head.appendChild(pageStyle);

    invoice.style.zoom = "0.656";
  }

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  setTimeout(() => {
    if (iframe.parentNode) document.body.removeChild(iframe);
  }, 1000);
};

export const buildInvoiceItems = (items: Order["items"]): InvoiceItem[] =>
  items.flatMap(item => {
    const withSize = (quantity: number) => `${quantity} ${item.size ?? ""}`.trim();

    if (item.variants?.length > 0) {
      return item.variants.map(variant => {
        const quantity = Number(variant.quantity) || 0;
        const amount = Number(variant.price) || 0;

        return {
          name: `${item.name} (${variant.color})`,
          quantity: withSize(quantity),
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
        quantity: withSize(quantity),
        rate: quantity ? amount / quantity : 0,
        amount,
      },
    ];
  });

export const printOrder = (order: Order, salesmanName?: string) => {
  const items = buildInvoiceItems(order.items);
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return printInvoice({
    customerName: order.customerName,
    orderId: order._id,
    phone: order.phone,
    date: new Date(order.createdAt),
    items,
    total,
    discount: order.discount,
    final: order.totalPrice,
    salesman: salesmanName ?? order.salesman?.username,
  });
};
