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
  IonList,
  IonAvatar,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, chevronForward, remove, add, trash } from 'ionicons/icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
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
    IonList,
    IonAvatar,
    IonBadge
  ]
})
export class CartPage {
  
  cartItem = {
    id: 1,
    name: 'AKG N700NCM2 Wireless Headphones',
    price: 199.00,
    tax: 10.00,
    quantity: 1,
    image: 'assets/headphones.jpg'
  };

  deliveryLocation = {
    address: '3 Persiaran Melkisridil St.',
    area: '60000, Thaill'
  };

  paymentMethod = {
    type: 'VISA Classic',
    cardNumber: '****0493'
  };

  shippingCost = 10.00;

  constructor() {
    addIcons({ chevronBack, chevronForward, remove, add, trash });
  }

  get subtotal(): number {
    return this.cartItem.price;
  }

  get total(): number {
    return this.subtotal + this.shippingCost;
  }

  increaseQuantity() {
    this.cartItem.quantity++;
  }

  decreaseQuantity() {
    if (this.cartItem.quantity > 1) {
      this.cartItem.quantity--;
    }
  }

  removeItem() {
    // Logic untuk remove item
    console.log('Remove item');
  }

  goBack() {
    // Logic untuk kembali ke halaman sebelumnya
    console.log('Go back');
  }

  checkout() {
    // Logic untuk checkout
    console.log('Checkout with total:', this.total);
  }
}