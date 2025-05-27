import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;


@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.page.html',
  styleUrls: ['./invoice-preview.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton
  ]

  

})
export class InvoicePreviewPage implements OnInit {
  order = {
    code: 'XYZ24DR',
    date: '12/01/2023',
    customer: 'Mazarina Farhana',
    email: 'mazarina@example.com',
    items: [
      { name: 'Battery Pro 5000', qty: 1, price: 420 }
    ],
    total: 420
  };

  user: any;

  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Token in invoice preview:', token);

    if (!token) {
      alert('Please login first!');
      window.location.href = '/login';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://127.0.0.1:8000/api/user', { headers }).subscribe({
      next: res => {
        this.user = res.data ?? res;
        console.log('Authenticated user:', this.user);
      },
      error: err => {
        console.error('Failed to fetch user:', err);
        if (err.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    });
  }

  download() {
    console.log('Download clicked ✅');
    console.log('pdfMake object:', pdfMake);
    const docDefinition = {
      content: [
        { text: 'Invoice', style: 'header' },
        { text: `Order Code: #${this.order.code}`, margin: [0, 10, 0, 2] },
        { text: `Date: ${this.order.date}` },
        { text: `Customer: ${this.order.customer}` },
        { text: `Email: ${this.order.email}`, margin: [0, 0, 0, 10] },
  
        {
          table: {
            widths: ['*', 'auto', 'auto'],
            body: [
              ['Item', 'Qty', 'Price (RM)'],
              ...this.order.items.map(item => [item.name, item.qty, item.price]),
              [
                { text: 'Total', bold: true },
                '',
                { text: this.order.total.toFixed(2), bold: true }
              ]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        }
      }
    };
  
    pdfMake.createPdf(docDefinition).download(`Invoice_${this.order.code}.pdf`);
  }
  
  goToInvoicePreview() {
    this.router.navigate(['/invoice-preview']);
    
  }

}
