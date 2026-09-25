import { HEADER_CUSTOMER_STYLES, TABLE_STYLES } from "../../shared";

export const STATEMENT_STYLES = `
  @page {
    size: A4;
    margin: 6mm 12mm 14mm;
  }

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
    background: #a487ad;
    padding: 6px 10px;
    border-radius: 4px 4px 0 0;
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

  .footer {
    margin-top: 30px;
    padding-top: 10px;
    border-top: 1px solid #eee;
    text-align: center;
    font-size: 10px;
    color: #999;
  }
`;
