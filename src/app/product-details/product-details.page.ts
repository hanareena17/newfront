import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButtons, IonBackButton, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonImg,  IonButtons, IonBackButton, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProductDetailsPage implements OnInit {

  product: any;

  constructor(private router: Router) { 
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state){
      this.product = nav.extras.state['product'];
    }
  }

  ngOnInit() {
  }

}
