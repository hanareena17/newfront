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
  IonBadge,
  IonInput,
  IonToast,
  ToastController,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.page.html',
  styleUrls: ['./add-to-cart.page.scss'],
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
    IonBadge,
    IonInput,
    IonToast,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader
  ]
})
export class AddToCartPage {
  product = {
    id: 1,
    name: 'AKG N700NCM2 Wireless Headphones',
    image: 'assets/headphones.jpg',
    price: 199.00,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockCount: 15
  };

  quantity = 1;
  selectedColor = 'black';
  selectedWarranty = '1year';
  selectedDelivery = 'standard';
  addInsurance = false;
  addGiftWrap = false;
  specialNotes = '';

  constructor(private toastController: ToastController) {
    addIcons({ cartOutline });
  }

  get totalPrice(): number {
    return this.product.price * this.quantity;
  }

  addToCart() {
    try {
      // Get existing cart or initialize empty array
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Add new item to cart
      cart.push({
        product: this.product,
        quantity: this.quantity,
        selectedColor: this.selectedColor,
        selectedWarranty: this.selectedWarranty,
        selectedDelivery: this.selectedDelivery,
        addInsurance: this.addInsurance,
        addGiftWrap: this.addGiftWrap,
        specialNotes: this.specialNotes,
        totalPrice: this.totalPrice
      });
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(cart));
      
      this.showToast('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showToast('Error adding item to cart');
    }
  }

  showToast(message: string) {
    this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    }).then(toast => toast.present());
  }
}
