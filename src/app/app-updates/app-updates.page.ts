import { Component, OnInit } from '@angular/core';
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
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonNote,
  IonButtons,
  IonBackButton,
  IonButton
} from '@ionic/angular/standalone';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface UpcomingFeature extends Feature {
  expectedDate: Date;
}

@Component({
  selector: 'app-app-updates',
  templateUrl: './app-updates.page.html',
  styleUrls: ['./app-updates.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonNote,
    IonButtons,
    IonBackButton,
    IonButton,
    CommonModule, 
    FormsModule
  ]
})
export class AppUpdatesPage implements OnInit {
  currentVersion: string = '1.0.0';
  
  currentFeatures: Feature[] = [
    {
      title: 'Battery Service Booking',
      description: 'Book battery inspection and replacement services',
      icon: 'calendar'
    },
    {
      title: 'Service History',
      description: 'View your past battery services and maintenance records',
      icon: 'time'
    },
    {
      title: 'Account Management',
      description: 'Manage your profile and vehicle information',
      icon: 'person'
    }
  ];

  upcomingFeatures: UpcomingFeature[] = [
    {
      title: 'Battery Health Tracking',
      description: 'Monitor your battery health with detailed analytics',
      icon: 'battery-charging',
      expectedDate: new Date('2024-04-15')
    },
    {
      title: 'Emergency Service',
      description: 'Request emergency battery replacement service',
      icon: 'warning',
      expectedDate: new Date('2024-04-30')
    },
    {
      title: 'Loyalty Program',
      description: 'Earn points and rewards for regular service',
      icon: 'star',
      expectedDate: new Date('2024-05-15')
    }
  ];

  constructor() { }

  ngOnInit() {
  }
}
