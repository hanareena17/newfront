import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonBadge,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, chevronForward, linkOutline, locationOutline, bagOutline } from 'ionicons/icons';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonBadge,
    IonChip
  ]
})
export class ProductDetailPage {
  
  product = {
    name: 'AKG N700NCM2',
    price: 199.00,
    originalPrice: 394.00,
    discount: 195.00,
    taxRate: 2,
    image: 'assets/headphones.jpg',
    shopInfo: {
      name: 'Hi-Fi Shop & Service Rustwell Ave ST.',
      description: 'This shop offers both products and services',
      address: 'Rustwell Ave ST.',
      area: '77 000, Binani'
    }
  };

  constructor() {
    addIcons({chevronBack,bagOutline,linkOutline,locationOutline,chevronForward});
  }

  get discountPercentage(): number {
    return Math.round((this.product.discount / this.product.originalPrice) * 100);
  }

  get taxAmount(): number {
    return (this.product.price * this.product.taxRate) / 100;
  }

  get finalPrice(): number {
    return this.product.price + this.taxAmount;
  }

  goBack() {
    // Logic untuk kembali ke halaman sebelumnya
    console.log('Go back');
  }

  addToCart() {
    // Logic untuk tambah ke cart
    console.log('Add to cart:', this.product.name);
  }

  viewShopDetails() {
    // Logic untuk lihat detail shop
    console.log('View shop details');
  }

  openShopLink() {
    // Logic untuk buka link shop
    console.log('Open shop link');
  }
}