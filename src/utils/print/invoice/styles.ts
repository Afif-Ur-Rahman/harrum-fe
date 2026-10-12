import { HEADER_CUSTOMER_STYLES, TABLE_STYLES } from "../shared";

export const INVOICE_STYLES = `
  @page {
    size: A4;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  html,
  body {
    margin: 0;
    padding: 6mm;
    background: #fff;
    font-family: Arial, Helvetica, sans-serif;
    color: #111;
  }

  ${HEADER_CUSTOMER_STYLES}

  ${TABLE_STYLES}

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 18px;
  }

  .doc-title {
    color: #ed1c24;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  .generated {
    font-size: 10px;
    color: #777;
  }

  .section {
    margin-top: 22px;
  }

  .section-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #fff;
    background: #1e293b;
    padding: 6px 10px;
    border-radius: 4px 4px 0 0;
    opacity: 0.85;
  }

  .no-data {
    margin-top: 22px;
    text-align: center;
    color: #999;
    font-size: 12px;
    border: 1px dashed #ddd;
    border-radius: 6px;
    padding: 18px;
  }

  .item-detail {
    font-size: 10px;
    color: #777;
    margin-top: 2px;
  }

  .footer {
    display: grid;
    grid-template-columns: 1fr 250px;
    gap: 30px;
    margin-top: 22px;
    padding-top: 12px;
    border-top: 2px solid #333;
  }

  .terms-title {
    margin-bottom: 6px;
    color: #555;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .terms-list {
    font-size: 9px;
    line-height: 1.5;
  }

  .totals {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .tbox {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 4px 0;
    font-size: 11px;
  }

  .tbox .lbl {
    font-weight: 700;
  }

  .tbox .val {
    font-weight: 700;
    white-space: nowrap;
  }

  .tbox.final {
    margin-top: 3px;
    padding-top: 7px;
    border-top: 2px solid #333;
    color: #ed1c24;
    font-size: 13px;
  }

  .saleman {
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
    border-top: 1px solid #ddd;
    font-size: 10px;
    font-weight: 600;
  }

  .saleman .name {
    color: #111;
    font-weight: 700;
  }

  .invoice {
    position: relative;
  }

  .paid-stamp {
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    padding: 4px 18px;
    border: 3px solid #ed1c24;
    outline: 1px solid #ed1c24;
    outline-offset: 2px;
    border-radius: 8px;
    color: #ed1c24;
    text-align: center;
    opacity: 0.65;
    pointer-events: none;
    z-index: 10;
  }

  .paid-stamp .stamp-brand {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .paid-stamp .stamp-title {
    font-size: 30px;
    font-weight: 900;
    letter-spacing: 5px;
    line-height: 1.1;
  }

  .paid-stamp .stamp-sub {
    font-size: 9px;
    font-weight: 700;
    border-top: 1px solid #ed1c24;
    margin-top: 2px;
    padding-top: 2px;
  }

  .header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }
  
  .support-stamp {
    position: absolute;
    top: 3mm;
    right: 6mm;
    padding: 3px 14px;
    border: 1px dashed #000;
    border-radius: 6px;
    color: #000;
    font-size: 11px;
    font-style: italic;
    letter-spacing: 1px;
    text-align: center;
    opacity: 0.7;
    pointer-events: none;
    z-index: 5;
  }
`;
