import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
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
export class NotificationsPage implements OnInit {
  notifications = [
    { icon: 'notifications-outline', title: 'Payment received', time: '2 hours ago' },
    { icon: 'car-outline', title: 'Car added successfully', time: 'Yesterday' },
    { icon: 'lock-closed-outline', title: 'Password changed', time: '3 days ago' }
  ];

  constructor() {}

  ngOnInit() {}
}
