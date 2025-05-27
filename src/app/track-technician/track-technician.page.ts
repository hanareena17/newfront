import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonProgressBar,
  IonCardContent,
  IonCardSubtitle,
  IonButtons, 
  IonBackButton
} from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-track-technician',
  templateUrl: './track-technician.page.html',
  styleUrls: ['./track-technician.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonProgressBar,
    IonCardContent,
    IonCardSubtitle,
    IonButtons,
    IonBackButton
  ]
})
export class TrackTechnicianPage implements OnInit, OnDestroy {
  technician: any = {
    name: 'Ahmad Bateri',
    status: 'On the way',
    location: 'Jalan Ampang, KL',
    progress: 0.3,
    eta: '25 minutes'
  };

  user: any = null;
  interval: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Fetch user data
    this.http.get<any>('http://127.0.0.1:8000/api/user', { headers }).subscribe({
      next: res => {
        this.user = res.data ?? res;
      },
      error: err => {
        console.error('Failed to fetch user:', err);
      }
    });

    // Simulate technician progress update
    this.interval = setInterval(() => {
      if (this.technician.progress < 1) {
        this.technician.progress += 0.1;
        this.technician.eta = this.getUpdatedEta();
      } else {
        this.technician.status = 'Arrived';
        clearInterval(this.interval);
      }
    }, 5000);
  }

  getUpdatedEta(): string {
    const minutesLeft = Math.max(0, Math.floor((1 - this.technician.progress) * 25));
    return `${minutesLeft} minutes`;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
