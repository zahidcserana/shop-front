import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() {}

  printInvoice(mode: 'a4' | 'pos', elementRef: ElementRef): void {
    const invoiceContent = elementRef.nativeElement;
    if (!invoiceContent) {
      console.error('Invoice section not found.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      console.error('Unable to open print window.');
      return;
    }

    const baseHref = document.getElementsByTagName('base')[0].getAttribute('href') || './';

    // 🔹 Common base styles (shared)
    const baseStyles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 15px;
          margin: 0;
          padding: 0px;
          background: #fff;
        }

        table {
          width: 100% !important;
          border-collapse: collapse;
        }

        th, td {
          padding: 6px 8px;
          text-align: left;
          vertical-align: middle;
        }

        th {
          background: #f5f5f5;
          font-weight: bold;
          border: 1px solid #000 !important;
          text-align: center;
        }

        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }

        #invoice_modal_id td {
          padding: 2px;
          font-size: 15px;
        }
      </style>

      <link rel="stylesheet" href="${baseHref}assets/css/bootstrap.min.css">
    `;

    // 🧾 POS mode
    const posStyles = `
      <style>
        @page {
          size: 80mm auto;
          margin: 3mm;
        }

        html, body {
          font-family: "Arial", sans-serif;
          font-size: 8px;
          line-height: 1.2;
          margin: 0;
          padding: 0;
          color: #000;
          text-align: center;
        }

        .invoice-box {
          width: 100%;
          max-width: 80mm;
          margin: 0 auto;
          padding: 2mm;
          box-sizing: border-box;
          text-align: center;
        }

        h1, h2, h3, h4, h5, p {
          margin: 0;
          padding: 0;
          line-height: 1.3;
        }

        h1 {
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2px;
        }

        h2 {
          font-size: 9px;
          text-align: center;
          font-weight: normal;
          margin-bottom: 2px;
        }

        .invoice-header p,
        .invoice-footer p {
          font-size: 8px;
          margin: 0;
          text-align: center;
        }

        .customer-info {
          text-align: left;
        }

        .shop-info {
          text-align: right;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #000;
          margin-top: 3px;
        }

        th, td {
          border: 1px solid #000;
          padding: 2px 3px;
          font-size: 8px;
          vertical-align: middle;
          word-wrap: break-word;
          text-align: center;
        }

        th {
          background: #f2f2f2;
          font-weight: bold;
        }

        tbody tr:nth-child(even) {
          background: #fafafa;
        }

        /* 🧾 Clean footer section */
        tfoot td {
          border: none !important;
          padding: 3px;
          font-size: 8px;
        }

        /* Subtle top border before totals */
        tfoot tr:first-child td {
          border-top: 1px solid #000 !important;
          padding-top: 4px;
        }

        .total-label {
          text-align: right;
          font-weight: bold;
          padding-right: 5px;
        }

        .total-value {
          text-align: right;
          font-weight: bold;
        }

        .grand-total {
          font-size: 9px;
          font-weight: bold;
          background: #f2f2f2;
          border-top: 1px solid #000 !important;
          padding: 4px 3px;
        }

        .invoice-header,
        .invoice-footer {
          text-align: center;
          margin-bottom: 3px;
        }

        /* 🖨 Fit neatly on one receipt page */
        @media print {
          html, body {
            width: 80mm;
            -webkit-print-color-adjust: exact;
            overflow: hidden;
            text-align: center;
          }

          .invoice-box {
            margin: 0 auto;
          }

          body {
            transform: scale(0.98);
            transform-origin: top center;
          }

          tfoot {
            position: static;
          }
        }
      </style>
    `;

    // 📄 A4 mode (each row fully boxed)
    const a4Styles = `
      <style>
        @page {
          size: A4;
          margin: 8mm;
        }

        html, body {
          font-family: "Arial", sans-serif;
          font-size: 15px;
          line-height: 1.2;
          margin: 0;
          padding: 0;
          color: #000;
          text-align: center;
          width: 100%;
        }

        .invoice-box {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 8mm;
          box-sizing: border-box;
          text-align: center;
        }

        h1, h2, h3, h4, h5, p {
          margin: 0;
          padding: 0;
          line-height: 1.3;
        }

        h1 {
          font-size: 15px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2px;
        }

        h2 {
          font-size: 15px;
          text-align: center;
          font-weight: normal;
          margin-bottom: 2px;
        }

        .invoice-header p,
        .invoice-footer p {
          font-size: 15px;
          margin: 0;
          text-align: center;
        }

        .customer-info {
          text-align: left;
        }

        .shop-info {
          text-align: right;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #000;
          margin-top: 3px;
        }

        th, td {
          border: 1px solid #000;
          padding: 2px 3px;
          font-size: 15px;
          vertical-align: middle;
          word-wrap: break-word;
          text-align: center;
        }

        th {
          background: #f2f2f2;
          font-weight: bold;
        }

        tbody tr:nth-child(even) {
          background: #fafafa;
        }

        /* 🧾 Clean footer section */
        tfoot td {
          border: none !important;
          padding: 3px;
          font-size: 15px;
        }

        /* Subtle top border before totals */
        tfoot tr:first-child td {
          border-top: 1px solid #000 !important;
          padding-top: 4px;
        }

        .total-label {
          text-align: right;
          font-weight: bold;
          padding-right: 5px;
        }

        .total-value {
          text-align: right;
          font-weight: bold;
        }

        .grand-total {
          font-size: 15px;
          font-weight: bold;
          background: #f2f2f2;
          border-top: 1px solid #000 !important;
          padding: 4px 3px;
        }

        .invoice-header,
        .invoice-footer {
          text-align: center;
          margin-bottom: 3px;
        }

        /* 🖨 Fit neatly on one receipt page */
        @media print {
          html, body {
            width: 80mm;
            -webkit-print-color-adjust: exact;
            overflow: hidden;
            text-align: center;
          }

          .invoice-box {
            margin: 0 auto;
          }

          body {
            transform: scale(0.98);
            transform-origin: top center;
          }

          tfoot {
            position: static;
          }
        }
      </style>
    `;

    const a4Styles2 = `
      <style>
        @page {
          size: A4;
          margin: 8mm;
        }

        html, body {
          font-family: Arial, sans-serif;
          font-size: 15px; /* ✅ Increased font size */
          line-height: 1.2;
          margin: 0;
          padding: 0;
          color: #000;
          background: #fff;
          width: 100%;
        }

        /* ✅ Full-width invoice layout */
        .invoice-box {
          width: 100%;
          max-width: 100%;
          padding: 0 8mm; /* safe edge spacing */
          box-sizing: border-box;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #000;
          table-layout: fixed;
          font-size: 15px; /* match global font size */
        }

        thead {
          display: table-header-group;
        }

        tfoot {
          display: table-footer-group;
          page-break-inside: avoid;
          border: none !important;
        }

        th, td {
          border: 1px solid #000;
          padding: 4px 6px; /* slightly larger padding for readability */
          vertical-align: middle;
          word-wrap: break-word;
        }

        th {
          background: #f2f2f2;
          font-weight: bold;
          text-align: center;
        }

        tbody tr:nth-child(even) {
          background: #fafafa;
        }

        tfoot td {
          border: none !important;
          padding: 4px 6px;
          font-size: 15px;
        }

        tfoot tr:first-child td {
          border-top: 1px solid #000 !important;
          padding-top: 6px;
        }

        .total-label {
          text-align: right;
          font-weight: bold;
          padding-right: 8px;
        }

        .total-value {
          text-align: right;
          font-weight: bold;
        }

        .grand-total {
          font-size: 15px;
          font-weight: bold;
          background: #f2f2f2;
          border-top: 1px solid #000 !important;
          padding: 6px 4px;
        }

        .invoice-header,
        .invoice-footer {
          padding: 6px;
          margin-bottom: 4px;
          font-size: 15px;
        }

        .invoice-header h2,
        .invoice-header p {
          margin: 0;
          font-size: 15px;
          line-height: 1.2;
        }

        .shop-info {
          text-align: right;
        }

        /* 🖨 Print optimization */
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            overflow: hidden;
          }

          .invoice-box {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0 8mm;
            box-sizing: border-box;
            transform: scale(1);
            transform-origin: top left;
          }

          tfoot {
            position: static;
          }
        }
      </style>
    `;

    const appliedStyles = baseStyles + (mode === 'pos' ? posStyles : a4Styles);

    const html = `
      <html>
        <head>${appliedStyles}</head>
        <body>
          <div class="invoice-box">${invoiceContent.innerHTML}</div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  printInvoice2(mode: 'a4' | 'pos', elementRef: ElementRef): void {
    const invoiceContent = elementRef.nativeElement;
    if (!invoiceContent) {
      console.error('Invoice section not found.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      console.error('Unable to open print window.');
      return;
    }

    const baseHref = document.getElementsByTagName('base')[0].getAttribute('href') || './';

    // 🔹 Common base styles (shared)
    const baseStyles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 17px;
          margin: 0;
          padding: 0px;
          background: #fff;
        }

        table {
          width: 100% !important;
          border-collapse: collapse;
        }

        th, td {
          padding: 6px 8px;
          text-align: left;
          vertical-align: middle;
        }

        td {
          border: 1px solid #728088 !important;
        }

        th {
          background: #f5f5f5;
          font-weight: bold;
          border: 1px solid #728088 !important;
          text-align: center;
        }

        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }

        #invoice_modal_id td {
          padding: 2px;
          font-size: 17px;
        }
      </style>

      <link rel="stylesheet" href="${baseHref}assets/css/bootstrap.min.css">
    `;

    // 🧾 POS mode
    const posStyles = `
      <style>
        @page {
          size: 80mm auto;
          margin: 3mm;
        }

        html, body {
          font-family: "Arial", sans-serif;
          font-size: 8px;
          line-height: 1.2;
          margin: 0;
          padding: 0;
          color: #000;
          text-align: center;
        }

        .invoice-box {
          width: 100%;
          max-width: 80mm;
          margin: 0 auto;
          padding: 2mm;
          box-sizing: border-box;
          text-align: center;
        }

        h1, h2, h3, h4, h5, p {
          margin: 0;
          padding: 0;
          line-height: 1.3;
        }

        h1 {
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2px;
        }

        h2 {
          font-size: 9px;
          text-align: center;
          font-weight: normal;
          margin-bottom: 2px;
        }

        .invoice-header p,
        .invoice-footer p {
          font-size: 8px;
          margin: 0;
          text-align: center;
        }

        .customer-info {
          text-align: left;
        }

        .shop-info {
          text-align: right;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #728088;
          margin-top: 3px;
        }

        th, td {
          border: 1px solid #728088;
          padding: 2px 3px;
          font-size: 8px;
          vertical-align: middle;
          word-wrap: break-word;
          text-align: center;
        }

        th {
          background: #f2f2f2;
          font-weight: bold;
        }

        tbody tr:nth-child(even) {
          background: #fafafa;
        }

        /* 🧾 Clean footer section */
        tfoot td {
          border: none !important;
          padding: 3px;
          font-size: 8px;
        }

        /* Subtle top border before totals */
        tfoot tr:first-child td {
          border-top: 1px solid #728088 !important;
          padding-top: 4px;
        }

        .total-label {
          text-align: right;
          font-weight: bold;
          padding-right: 5px;
        }

        .total-value {
          text-align: right;
          font-weight: bold;
        }

        .amount-word {
          font-size: 8px;
          padding: 1%;
        }
        
        .thanku {
          text-align: center;
          font-weight: bold;
          font-size: 8px;
        }

        .grand-total {
          font-size: 9px;
          font-weight: bold;
          background: #f2f2f2;
          border-top: 1px solid #728088 !important;
          padding: 4px 3px;
        }

        .invoice-header,
        .invoice-footer {
          text-align: center;
          margin-bottom: 3px;
        }

        /* 🖨 Fit neatly on one receipt page */
        @media print {
          html, body {
            width: 80mm;
            -webkit-print-color-adjust: exact;
            overflow: hidden;
            text-align: center;
          }

          .invoice-box {
            margin: 0 auto;
          }

          body {
            transform: scale(0.98);
            transform-origin: top center;
          }

          tfoot {
            position: static;
          }
        }
      </style>
    `;

    // 📄 A4 mode (each row fully boxed)
    const a4Styles = `
      <style>
        @page {
          size: A4;
          margin: 8mm;
        }

        html, body {
          font-family: "Arial", sans-serif;
          font-size: 17px;
          line-height: 1.2;
          margin: 0;
          padding: 0;
          color: #000;
          text-align: center;
          width: 100%;
        }

        .invoice-box {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 8mm;
          box-sizing: border-box;
          text-align: center;
        }

        h1, h2, h3, h4, h5, p {
          margin: 0;
          padding: 0;
          line-height: 1.3;
        }

        h1 {
          font-size: 17px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2px;
        }

        h2 {
          font-size: 17px;
          text-align: center;
          font-weight: normal;
          margin-bottom: 2px;
        }

        .invoice-header p,
        .invoice-footer p {
          font-size: 17px;
          margin: 0;
          text-align: center;
        }

        .customer-info {
          text-align: left;
        }

        .shop-info {
          text-align: right;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #728088;
          margin-top: 3px;
        }

        th, td {
          border: 1px solid #728088;
          padding: 2px 3px;
          font-size: 17px;
          vertical-align: middle;
          word-wrap: break-word;
          text-align: center;
        }

        td {
          border: 0.5px solid #728088;
          padding: 2px 3px;
          font-size: 17px;
          vertical-align: middle;
          word-wrap: break-word;
          text-align: center;
        }

        th {
          background: #f2f2f2;
          font-weight: bold;
        }

        tbody tr:nth-child(even) {
          background: #fafafa;
        }

        /* 🧾 Clean footer section */
        tfoot td {
          border: none !important;
          padding: 3px;
          font-size: 17px;
        }

        /* Subtle top border before totals */
        tfoot tr:first-child td {
          border-top: 1px solid #728088 !important;
          padding-top: 4px;
        }

        .total-label {
          text-align: right;
          font-weight: bold;
          padding-right: 5px;
        }

        .total-value {
          text-align: right;
          font-weight: bold;
        }

        .amount-word {
          font-size: 17px;
          padding: 1%;
        }

        .thanku {
          text-align: center;
          font-weight: bold;
          font-size: 17px;
        }

        .grand-total {
          font-size: 17px;
          font-weight: bold;
          background: #f2f2f2;
          border-top: 1px solid #728088 !important;
          padding: 4px 3px;
        }

        .invoice-header,
        .invoice-footer {
          text-align: center;
          margin-bottom: 3px;
        }

        /* 🖨 Fit neatly on one receipt page */
        @media print {
          html, body {
            width: 80mm;
            -webkit-print-color-adjust: exact;
            overflow: hidden;
            text-align: center;
          }

          .invoice-box {
            margin: 0 auto;
          }

          body {
            transform: scale(0.98);
            transform-origin: top center;
          }

          tfoot {
            position: static;
          }
        }
      </style>
    `;

    const appliedStyles = baseStyles + (mode === 'pos' ? posStyles : a4Styles);

    const html = `
      <html>
        <head>${appliedStyles}</head>
        <body>
          <div class="invoice-box">${invoiceContent.innerHTML}</div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }
}
