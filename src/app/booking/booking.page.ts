import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage {
  serviceType: string = '';
  notes: string = '';
  preferredDate: string = '';
  preferredTime: string = '';
  location: string = '';

  constructor(private navCtrl: NavController) {}

  submitBooking() {
    if (!this.serviceType) {
      alert('Please choose a service type.');
      return;
    }

    const bookingData = {
      serviceType: this.serviceType,
      preferredDate: this.preferredDate,
      preferredTime: this.preferredTime,
      location: this.location,
      notes: this.notes
    };

    console.log('Booking submitted:', this.serviceType, this.notes);
    alert('Your booking has been submitted!');
    this.navCtrl.navigateBack('/home');
  }
}
