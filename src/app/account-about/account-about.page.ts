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
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

interface UserData {
  username: string;
  email: string;
  createdAt: Date;
  totalBookings: number;
  activeBookings: number;
}

@Component({
  selector: 'app-account-about',
  templateUrl: './account-about.page.html',
  styleUrls: ['./account-about.page.scss'],
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
    IonButtons,
    IonBackButton,
    CommonModule, 
    FormsModule
  ]
})
export class AccountAboutPage implements OnInit {
  userData: UserData | null = null;

  constructor() { }

  ngOnInit() {
    // TODO: Replace this with actual API call to get user data
    this.userData = {
      username: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date('2024-01-01'),
      totalBookings: 5,
      activeBookings: 2
    };
  }
}
