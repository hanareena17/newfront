import { Component, OnInit } from '@angular/core';
import { IonContent, IonButtons, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-batteries',
  templateUrl: './batteries.page.html',
  styleUrls: ['./batteries.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader,  IonButtons, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class BatteriesPage implements OnInit {

  batteryBrands = [
    {
      name: 'Amaron',
      image: 'assets/batteries/Amaron.png',
      founded: '2000',
      origin: 'India',
      history: 'Amaron was launched by Amara Raja Batteries Ltd. and Johnson Controls. It quickly gained popularity for its zero-maintenance, long-lasting batteries suitable for harsh climates.'
    },
    {
      name: 'Bosch',
      image: 'assets/batteries/bosch.png',
      founded: '1886',
      origin: 'Germany',
      history: 'Bosch has been a pioneer in automotive technologies. Their batteries are engineered with cutting-edge German tech and are widely trusted across the globe.'
    },
    // Add the rest similarly...
  ];
  
  constructor() { }

  ngOnInit() {}
}
