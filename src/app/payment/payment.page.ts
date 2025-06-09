import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonRadio, IonRadioGroup, IonInput, IonText } from '@ionic/angular/standalone';
import { NavController, ToastController } from '@ionic/angular';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, 
    IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonList, IonItem, IonRadio, IonRadioGroup, IonInput, IonText,
    CommonModule, FormsModule
  ]
})
export class PaymentPage implements OnInit {
  bookingSummary: any = null;
  selectedPaymentMethod: string = '';
  voucherCode: string = '';
  voucherApplied: boolean = false;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;

  constructor(
    private navCtrl: NavController,
    private bookingService: BookingService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadBookingSummary();
    this.calculateAmounts();
  }

  private async loadBookingSummary() {
    const bookingId = localStorage.getItem('currentBookingId');
    if (bookingId) {
      try {
        const bookingObservable = await this.bookingService.getBooking(bookingId);
        const response = await bookingObservable.toPromise();
        if (response && 'data' in response) {
          this.bookingSummary = response.data;
          this.calculateAmounts();
        }
      } catch (error) {
        console.error('Error loading booking summary:', error);
        this.presentToast('Failed to load booking details');
      }
    }
  }

  private calculateAmounts() {
    // Set base price based on service type
    switch (this.bookingSummary?.service_type) {
      case 'battery_replacement':
        this.subtotal = 299;
        break;
      case 'battery_charging':
        this.subtotal = 99;
        break;
      case 'jump_start':
        this.subtotal = 49;
        break;
      default:
        this.subtotal = 0;
    }

    // Calculate total with discount if voucher is applied
    this.total = this.subtotal - this.discount;
  }

  async applyVoucher() {
    if (!this.voucherCode) {
      this.presentToast('Please enter a voucher code');
      return;
    }

    try {
      // Here you would typically call your API to validate the voucher
      // For now, we'll simulate a successful validation
      if (this.voucherCode.toUpperCase() === 'WELCOME10') {
        this.discount = this.subtotal * 0.1; // 10% discount
        this.voucherApplied = true;
        this.calculateAmounts();
        this.presentToast('Voucher applied successfully!');
      } else {
        this.presentToast('Invalid voucher code');
      }
    } catch (error) {
      console.error('Error applying voucher:', error);
      this.presentToast('Failed to apply voucher');
    }
  }

  removeVoucher() {
    this.voucherCode = '';
    this.voucherApplied = false;
    this.discount = 0;
    this.calculateAmounts();
  }

  async processPayment() {
    if (!this.selectedPaymentMethod) {
      this.presentToast('Please select a payment method');
      return;
    }

    try {
      // Here you would typically process the payment through your payment gateway
      // For now, we'll simulate a successful payment
      this.presentToast('Payment processed successfully!');
      
      // Clear booking data and navigate to home
      localStorage.removeItem('currentBookingId');
      localStorage.removeItem('selectedLocation');
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      console.error('Error processing payment:', error);
      this.presentToast('Failed to process payment');
    }
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
