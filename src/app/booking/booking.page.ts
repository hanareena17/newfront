import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular'; // Added AlertController
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'; // Added HttpClient, HttpClientModule, HttpHeaders
import { environment } from '../../environments/environment'; // Assuming you have an environment file for API URL
import { AuthService } from '../services/auth.service'; // Added AuthService

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule], // Added HttpClientModule
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage {
  serviceType: string = '';
  notes: string = '';
  preferredDate: string = '';
  preferredTime: string = '';
  location: string = '';

  // It's good practice to store your API URL in environment files
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api'; // Fallback if not in environment

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertController: AlertController, // Added AlertController
    private authService: AuthService // Added AuthService
  ) {}

  async submitBooking() {
    if (!this.serviceType) {
      this.presentAlert('Validation Error', 'Please choose a service type.');
      return;
    }

    // Map to backend expected snake_case keys
    const bookingPayload = {
      service_type: this.serviceType,
      preferred_date: this.preferredDate ? new Date(this.preferredDate).toISOString().split('T')[0] : null, // Format as YYYY-MM-DD
      preferred_time: this.preferredTime ? new Date(this.preferredTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : null, // Format as HH:MM
      location: this.location,
      notes: this.notes
    };

    console.log('Submitting booking payload:', bookingPayload);

    const token = this.authService.getToken();
    if (!token) {
      this.presentAlert('Error', 'You are not authenticated. Please log in.');
      // Optionally navigate to login page
      // this.navCtrl.navigateRoot('/login');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(`${this.apiUrl}/bookings`, bookingPayload, { headers }).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.presentAlert('Success', 'Your booking has been submitted!');
        this.navCtrl.navigateBack('/home');
      },
      error: (error) => {
        console.error('Error submitting booking:', error);
        let errorMessage = 'Failed to submit booking. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
          if (error.error.errors && typeof error.error.errors === 'object') {
            // Append validation errors if available
            // Replace .flat() with a compatible alternative
            const allErrors = Object.values(error.error.errors) as string[][]; // Assuming errors are string[][]
            const validationErrors = allErrors.reduce((acc, val) => acc.concat(val), []).join('\n');
            errorMessage += `\n\nDetails:\n${validationErrors}`;
          }
        }
        this.presentAlert('Error', errorMessage);
      }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
