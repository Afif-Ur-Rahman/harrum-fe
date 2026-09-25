import { Order } from "@/types";

import { InvoiceHtml } from "./html";
import { InvoiceItems } from "./items";
import { InvoiceData } from "./types";

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
  doc.write(InvoiceHtml(data));
  doc.close();

  const images = Array.from(doc.images);

  await Promise.race([
    Promise.all(
      images.map(
        img =>
          new Promise<void>(resolve => {
            if (img.complete) {
              resolve();
              return;
            }

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

    pageStyle.textContent = `
      @page {
        size: 210mm ${heightMm}mm;
        margin: 0;
      }
    `;

    doc.head.appendChild(pageStyle);

    invoice.style.zoom = "0.656";
  }

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  setTimeout(() => {
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  }, 1000);
};

export const printOrder = (order: Order, salesmanName?: string) => {
  const items = InvoiceItems(order.items);
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
