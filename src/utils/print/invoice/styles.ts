import { HEADER_CUSTOMER_STYLES, TABLE_STYLES } from "../shared";

export const INVOICE_STYLES = `
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #fff;
    font-family: Arial, Helvetica, sans-serif;
    color: #111;
  }

  ${HEADER_CUSTOMER_STYLES}

  ${TABLE_STYLES}

  .invoice {
    width: 1210px;
    border: 2px solid #9a9a9a;
    padding: 30px 30px 20px;
    position: relative;
    background: #fff;
  }

  .invoice-items {
    margin-top: 22px;
  }

  .item-detail {
    margin-top: 2px;
    color: #777;
    font-size: 10px;
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
    color: #777;
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
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid #ddd;
    color: #777;
    font-size: 10px;
    font-weight: 600;
  }

  .saleman .name {
    color: #111;
    font-weight: 700;
  }
`;
