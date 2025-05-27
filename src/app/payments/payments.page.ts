import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardContent, IonLabel, IonItem} from '@ionic/angular/standalone';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonCard, IonCardContent, IonLabel, IonItem]
})
export class PaymentsPage implements OnInit {

  payments = [
    { date: '2025-04-10', type: 'Topup', amount: 150 },
    { date: '2025-04-12', type: 'Withdrawal', amount: -80 },
    { date: '2025-04-13', type: 'Payout', amount: 320 }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
