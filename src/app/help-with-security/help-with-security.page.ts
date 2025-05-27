import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonIcon
} from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-with-security',
  templateUrl: './help-with-security.page.html',
  styleUrls: ['./help-with-security.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonList,
    IonIcon
  ]
})
export class HelpWithSecurityPage implements OnInit {
  tips = [
    { icon: 'lock-closed-outline', title: 'Use a strong and unique password' },
    { icon: 'key-outline', title: 'Never share your login credentials' },
    { icon: 'shield-checkmark-outline', title: 'Enable two-factor authentication (2FA)' },
    { icon: 'alert-circle-outline', title: 'Report suspicious activities immediately' }
  ];

  user: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>('http://127.0.0.1:8000/api/user', { headers }).subscribe({
      next: res => {
        this.user = res.data ?? res;
        console.log('User Info:', this.user);
      },
      error: err => {
        console.error('Failed to fetch user info:', err);
      }
    });
  }
}
