import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
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
    IonInput,
    IonButton
  ]
})
export class PrivacyPage implements OnInit {
  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor() {}

  ngOnInit(): void {}

  changePassword() {
    console.log('🔒 Change Password Request:', this.passwords);
    // UI only – no API yet
  }
}
