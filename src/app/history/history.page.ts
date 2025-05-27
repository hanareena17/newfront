import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonList,
  IonButton,
  IonCardContent,
  IonCardHeader
} from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonList,
    CommonModule,
    FormsModule,
    IonButton,
    IonCardContent,
    IonCardHeader
  ]
})
export class HistoryPage implements OnInit {
  user: any;

  orderHistory = [
    {
      date: '12/01/2023',
      code: 'XYZ24DR',
      items: [
        {
          name: 'Battery Pro 5000',
          qty: 1,
          price: 420,
          img: 'assets/batteries/Amaron.png',
          warrantyStatus: 'Active',
          warrantyDetails: {
            serialNumber: 'SN234234234',
            startDate: '12/01/2023',
            endDate: '12/01/2025',
            notes: '2 years warranty, covers manufacturing defects only.'
          }
        }
      ],
    }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>('http://127.0.0.1:8000/api/user', { headers }).subscribe({
      next: res => {
        this.user = res.data ?? res;
      },
      error: err => {
        console.error('Failed to fetch user:', err);
      }
    });
  }

  downloadInvoice(){
    console.log('Invoice download initiated (dummy)');
  }

  goToInvoicePreview(){
    this.router.navigate(['/invoice-preview']);

  }
}
