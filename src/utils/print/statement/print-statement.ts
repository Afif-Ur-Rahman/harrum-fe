import { StatementHtml } from "./html";
import type { StatementData } from "./types";

import { StatementFileName } from "../shared";

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

  const fileName = StatementFileName(data.partyName, new Date());

  doc.open();
  doc.write(StatementHtml(data));
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

  const originalTitle = document.title;

  document.title = fileName;

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  const restoreTitle = () => {
    document.title = originalTitle;

    iframe.contentWindow?.removeEventListener("afterprint", restoreTitle);
  };

  iframe.contentWindow?.addEventListener("afterprint", restoreTitle);

  setTimeout(() => {
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }

    document.title = originalTitle;
  }, 1500);
};
