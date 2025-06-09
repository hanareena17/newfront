import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormsModule } from '@angular/forms'; // Import FormsModule if using ngModel

pdfMake.vfs = pdfFonts.vfs;

// Import for the download icon
import { downloadOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.page.html',
  styleUrls: ['./invoice-preview.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon
  ]
})
export class InvoicePreviewPage implements OnInit {
  // Placeholder for invoice data - replace with actual data from your service or input
  invoiceData = {
    company: {
      name: 'BATERIKERETA (M) SDN. BHD.',
      regNo: '(202101044645 / 1444945-T)',
      addressLine1: 'G-01, KSL AVERY PARK, Pangsapuri Rinting Indah, Jalan Rinting, Taman Rinting Indah',
      addressLine2: '81750 Masai, Johor',
      country: 'Malaysia',
      contact: '+60167306468 / baterikeretahq@gmail.com',
      website: 'https://baterikereta.com',
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABH2h3dAAAAA...==' // Replace with actual base64 logo
    },
    billTo: {
      name: 'SEABOARD ENGINEERING',
      phone: '+60123560339'
    },
    invoiceInfo: {
      no: 'IV-46190',
      date: '05/04/2025',
      paymentTerm: 'COD',
      dueDate: '05/04/2025'
    },
    items: [
      { no: 1, description: 'FBM - NX120L (95D31L)\n6 MONTHS WARRANTY\nJRG4067', qty: 1, unitPrice: 330.00, amount: 330.00, disc: 0.00, tax: 0.00 }
      // Add more items as needed
    ],
    totals: {
      subtotal: 330.00,
      total: 330.00
    },
    remarks: [
      'TERM & CONDITIONS DURING THE PURCHASE',
      'EVERY PURCHASE OF PRODUCTS IS SUBJECT TO THE FOLLOWING TERMS & CONDITIONS :',
      'ALL GOODS SOLD ARE NOT EXCHANGEABLE AND REFUNDABLE.',
      "FOR BATTERY PURCHASE, GENUINE WARRANTY CLAIM ONLY APPLICABLE FOR BATTERY DEFECT AND NOT-APPLICABLE FOR CUSTOMERS NEGLIGENCE AND VEHICLE PROBLEM IE ' ALTERNATOR, STATER, WIRING, ETC '"
    ],
    notes: [
      'ALL CHEQUES SHOLUD BE CROSSED AND MADE PAYABLE TO :',
      'BATERIKERETA (M) SDN. BHD.',
      'MAYBANK : 551333556309'
    ],
    companyStamp: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAACICAIAAABcTzHMAAAAA...==' // Replace with actual base64 stamp
  };

  user: any;

  constructor(private http: HttpClient, private router: Router) {
    addIcons({ downloadOutline }); // Add the icon to the library
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle not logged in
      // this.router.navigate(['/login']);
      console.warn('User not logged in, using placeholder data for invoice.');
      return;
    }

    // Fetch user or other necessary data if needed
    // For now, we'll use the static invoiceData
  }

  async downloadInvoice() {
    console.log('Download Invoice clicked');

    // You might need to fetch the logo and stamp images and convert them to base64
    // For example:
    // const logoBase64 = await this.getBase64ImageFromURL('assets/icon/logo.png');
    // const stampBase64 = await this.getBase64ImageFromURL('assets/icon/stamp.png'); // Assuming you have stamp.png

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60], // [left, top, right, bottom]
      content: [
        // Company Header
        {
          columns: [
            {
              image: this.invoiceData.company.logo, // Replace with actual base64 data or URL if pdfmake supports it directly
              width: 80,
              // fit: [80, 80] // if you want to scale it
            },
            {
              stack: [
                { text: this.invoiceData.company.name, style: 'companyName' },
                { text: this.invoiceData.company.regNo, style: 'companySubDetail' },
                { text: this.invoiceData.company.addressLine1, style: 'companySubDetail' },
                { text: this.invoiceData.company.addressLine2, style: 'companySubDetail' },
                { text: this.invoiceData.company.country, style: 'companySubDetail' },
                { text: `Contact: ${this.invoiceData.company.contact}`, style: 'companySubDetail' },
                { text: `Website: ${this.invoiceData.company.website}`, style: 'companySubDetail' },
              ],
              margin: [10, 0, 0, 0] // margin: [left, top, right, bottom]
            }
          ],
          columnGap: 10,
          margin: [0, 0, 0, 20] // Margin below company header
        },

        // Invoice Meta
        {
          columns: [
            {
              stack: [
                { text: 'INVOICE', style: 'invoiceTitle' },
                { text: 'BILL TO', style: 'billToTitle' },
                { text: this.invoiceData.billTo.name, style: 'billToText', bold: true },
                { text: `PHONE NO.    ${this.invoiceData.billTo.phone}`, style: 'billToText' }
              ]
            },
            {
              table: {
                widths: ['auto', '*'],
                body: [
                  [{ text: 'NO.', style: 'invoiceInfoLabel' }, { text: this.invoiceData.invoiceInfo.no, style: 'invoiceInfoValue' }],
                  [{ text: 'DATE', style: 'invoiceInfoLabel' }, { text: this.invoiceData.invoiceInfo.date, style: 'invoiceInfoValue' }],
                  [{ text: 'PAYMENT TERM', style: 'invoiceInfoLabel' }, { text: this.invoiceData.invoiceInfo.paymentTerm, style: 'invoiceInfoValue' }],
                  [{ text: 'DUE DATE', style: 'invoiceInfoLabel' }, { text: this.invoiceData.invoiceInfo.dueDate, style: 'invoiceInfoValue' }]
                ]
              },
              layout: 'noBorders', // Removes default table borders
              margin: [0, 10, 0, 0] // Adjust top margin to align with "INVOICE" title
            }
          ],
          margin: [0, 0, 0, 15], // Margin below invoice meta
          // Add a line below this section
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1.5, lineColor: '#ff6f00' }], margin: [0,0,0,15]},


        // Items Table
        {
          table: {
            headerRows: 1,
            widths: [25, '*', 35, 55, 55, 45, 45], // Adjusted widths
            body: [
              [
                { text: 'NO.', style: 'tableHeader' },
                { text: 'DESCRIPTION', style: 'tableHeader' },
                { text: 'QTY', style: 'tableHeader', alignment: 'center' },
                { text: 'U/PRICE', style: 'tableHeader', alignment: 'right' },
                { text: 'AMT', style: 'tableHeader', alignment: 'right' },
                { text: 'DISC', style: 'tableHeader', alignment: 'right' },
                { text: 'TAX', style: 'tableHeader', alignment: 'right' }
              ],
              ...this.invoiceData.items.map(item => [
                { text: item.no.toString(), style: 'tableCell', alignment: 'center' },
                { text: item.description, style: 'tableCell' },
                { text: item.qty.toString(), style: 'tableCell', alignment: 'center' },
                { text: item.unitPrice.toFixed(2), style: 'tableCell', alignment: 'right' },
                { text: item.amount.toFixed(2), style: 'tableCell', alignment: 'right' },
                { text: item.disc.toFixed(2), style: 'tableCell', alignment: 'right' },
                { text: item.tax.toFixed(2), style: 'tableCell', alignment: 'right' }
              ])
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: any) { return (i === 0 || i === node.table.body.length || i === 1) ? 1 : 0.5; },
            vLineWidth: function (i: number, node: any) { return (i === 0 || i === node.table.widths.length) ? 1 : 0.5; },
            hLineColor: function (i: number, node: any) { return (i === 0 || i === node.table.body.length || i === 1) ? '#ff6f00' : '#dddddd'; },
            vLineColor: function (i: number, node: any) { return (i === 0 || i === node.table.widths.length) ? '#ff6f00' : '#dddddd'; },
            paddingTop: function(i:any, node:any) { return 5; },
            paddingBottom: function(i:any, node:any) { return 5; },
          },
          margin: [0, 0, 0, 20] // Margin below items table
        },

        // Totals Section
        {
          columns: [
            { width: '*', text: '' }, // Spacer
            {
              width: 'auto',
              table: {
                widths: ['auto', 'auto'],
                body: [
                  [{ text: 'SUBTOTAL', style: 'totalLabel' }, { text: `RM${this.invoiceData.totals.subtotal.toFixed(2)}`, style: 'totalValue', alignment: 'right' }],
                  [{ text: 'TOTAL', style: 'totalLabelGrand' }, { text: `RM${this.invoiceData.totals.total.toFixed(2)}`, style: 'totalValueGrand', alignment: 'right' }]
                ]
              },
              layout: {
                hLineWidth: function (i: number, node: any) {
                  return (i === node.table.body.length -1) ? 1.5 : 0; // Line above TOTAL
                },
                vLineWidth: function () { return 0; },
                hLineColor: function (i: number, node: any) {
                    return (i === node.table.body.length -1) ? '#ff6f00' : '#dddddd';
                },
                 paddingTop: function(i:any, node:any) { return i === node.table.body.length -1 ? 6 : 3; }, // More padding for TOTAL
                 paddingBottom: function(i:any, node:any) { return 3; },
              }
            }
          ],
           margin: [0, 0, 0, 5], // Margin below totals
        },
        // Double line for TOTAL
        { canvas: [{ type: 'line', x1: 330, y1: 0, x2: 595 - 2 * 40, y2: 0, lineWidth: 0.5, lineColor: '#ff6f00' }], margin: [0,0,0,20]},


        // Remarks
        { text: 'REMARKS', style: 'sectionTitle', margin: [0, 0, 0, 5] },
        ...this.invoiceData.remarks.map(remark => ({ text: remark, style: 'smallText', margin: [0, 0, 0, 2] })),

        // Notes
        { text: 'NOTES :', style: 'sectionTitle', margin: [0, 10, 0, 5] },
        ...this.invoiceData.notes.map(note => ({ text: note, style: 'smallText', margin: [0, 0, 0, 2] })),

        // Footer with Stamp and Authorised By
        {
          columns: [
            {
              image: this.invoiceData.companyStamp, // Replace with actual base64 stamp
              width: 80,
              // fit: [80, 80],
              margin: [0, 20, 0, 0]
            },
            { width: '*', text: '' }, // Spacer
            {
              stack: [
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 150, y2: 5, lineWidth: 1, lineColor: '#ff6f00' }], margin: [0, 35, 0, 5] }, // Line for signature
                { text: 'Authorised By', style: 'smallText', alignment: 'left' } // Changed to left
              ],
              width: 'auto',
              alignment: 'right', // This aligns the stack to the right of its column
            }
          ],
          margin: [0, 20, 0, 10] // Margin above page number
        }
      ],
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: `Page ${currentPage.toString()} / ${pageCount.toString()}`,
          alignment: 'right',
          style: 'footerText',
          margin: [0, 0, 40, 0] // Adjust right margin to align with page content
        };
      },
      styles: {
        companyName: { fontSize: 14, bold: true, margin: [0, 0, 0, 2] },
        companySubDetail: { fontSize: 8, margin: [0, 0, 0, 1] },
        invoiceTitle: { fontSize: 20, bold: true, color: '#ff6f00', margin: [0, 0, 0, 10] },
        billToTitle: { fontSize: 9, bold: true, margin: [0, 5, 0, 2] },
        billToText: { fontSize: 9, margin: [0, 0, 0, 2] },
        invoiceInfoLabel: { fontSize: 9, bold: false, margin: [0, 1, 5, 1], color: '#555555' }, // Added right margin
        invoiceInfoValue: { fontSize: 9, bold: true, margin: [0, 1, 0, 1] },
        tableHeader: { bold: true, fontSize: 9, color: '#ff6f00', fillColor: '#f8f8f8', margin: [0, 2, 0, 2] },
        tableCell: { fontSize: 8.5, margin: [0, 2, 0, 2] },
        totalLabel: { fontSize: 9, bold: true },
        totalValue: { fontSize: 9, bold: true },
        totalLabelGrand: { fontSize: 10, bold: true, color: '#ff6f00' },
        totalValueGrand: { fontSize: 10, bold: true, color: '#ff6f00' },
        sectionTitle: { fontSize: 9, bold: true, margin: [0, 5, 0, 3] },
        smallText: { fontSize: 8 },
        footerText: { fontSize: 8, color: '#777777' }
      },
      defaultStyle: {
        font: 'Roboto', // pdfmake uses Roboto by default if not specified. Ensure vfs_fonts includes it.
        fontSize: 10,
        lineHeight: 1.2
      }
    };

    pdfMake.createPdf(docDefinition).download(`Invoice_${this.invoiceData.invoiceInfo.no}.pdf`);
  }

  // Helper function to convert image URL to base64 (optional, if images are not already base64)
  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          reject(new Error('Could not get canvas context.'));
        }
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  // goToInvoicePreview() {
  //   this.router.navigate(['/invoice-preview']);
  // }
}
