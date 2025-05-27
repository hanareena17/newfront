import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-to-help-center',
  templateUrl: './to-help-center.page.html',
  styleUrls: ['./to-help-center.page.scss'],
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
export class ToHelpCenterPage implements OnInit {
  faqs = [
    { icon: 'help-circle-outline', question: 'How do I reset my password?' },
    { icon: 'card-outline', question: 'How do I update my payment info?' },
    { icon: 'car-outline', question: 'Where do I manage my car details?' },
    { icon: 'shield-outline', question: 'Is my data secure?' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
