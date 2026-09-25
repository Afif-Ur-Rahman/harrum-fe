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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #ed1c24;
    padding-bottom: 12px;
  }

  .logo img {
    height: auto;
    width: 200px;
    display: block;
  }

  .contacts {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 6px 20px;
    align-items: center;
    justify-content: end;
  }

  .contact {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 13px;
    white-space: nowrap;
    text-decoration: none;
    color: inherit;
  }

  .contact:hover {
    opacity: 0.8;
  }

  .contact svg {
    flex-shrink: 0;
  }

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

  .customer-box {
    margin-top: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    background: #fafafa;
  }

  .customer-box .field {
    font-size: 12.5px;
  }

  .customer-box .field .lbl {
    color: #777;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 9.5px;
    letter-spacing: 0.4px;
    display: block;
  }

  .customer-box .field .val {
    font-weight: 700;
    margin-top: 2px;
  }

  .customer-box .balance .val {
    color: var(--balance-color);
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

  table.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5px;
  }

  table.data-table th {
    background: #f1eef3;
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 6px 8px;
    border-bottom: 2px solid #ddd;
    color: #555;
  }

  table.data-table td {
    padding: 6px 8px;
    border-bottom: 1px solid #eee;
    vertical-align: top;
  }

  table.data-table tr:last-child td {
    border-bottom: 1px solid #ddd;
  }

  table.data-table .idx {
    width: 24px;
    color: #999;
  }

  table.data-table .num {
    text-align: right;
    white-space: nowrap;
    font-weight: 600;
  }

  table.data-table .cap {
    text-transform: capitalize;
  }

  table.data-table .items {
    max-width: 260px;
  }

  table.data-table .total-row td {
    border-top: 2px solid #333;
    border-bottom: none;
    padding-top: 8px;
  }

  table.data-table .total-row .label {
    text-align: right;
    font-weight: 700;
    font-size: 11px;
  }

  table.data-table .total-row .total {
    font-size: 13px;
    color: #ed1c24;
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
