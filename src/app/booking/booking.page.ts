import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController, ToastController } from '@ionic/angular';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { CarService, UserCar } from '../services/car.service';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  serviceType: string = '';
  notes: string = '';
  preferredDate: string = '';
  preferredTime: string = '';
  location: string = '';
  selectedCarId: string = '';
  userCars: UserCar[] = [];
  minDate: string = new Date().toISOString();
  maxDate: string = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
  latitude: number = 0;
  longitude: number = 0;

  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    private authService: AuthService,
    private carService: CarService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.loadUserCars();
    this.checkSelectedLocation();
  }

  checkSelectedLocation() {
    const selectedLocation = localStorage.getItem('selectedLocation');
    if (selectedLocation) {
      const location = JSON.parse(selectedLocation);
      this.location = location.address || 'Selected Location';
      this.latitude = location.lat;
      this.longitude = location.lng;
    }
  }

  goToMap() {
    this.navCtrl.navigateForward('/map');
  }

  async loadUserCars() {
    try {
      this.userCars = await this.carService.getUserCars().toPromise() || [];
    } catch (error) {
      console.error('Error loading user cars:', error);
      this.presentAlert('Error', 'Failed to load your cars. Please try again.');
    }
  }

  goToCarInfo() {
    this.navCtrl.navigateForward('/car-info');
  }

  async submitBooking() {
    if (!this.serviceType) {
      this.presentToast('Please select a service type');
      return;
    }
    if (!this.selectedCarId) {
      this.presentToast('Please select a car');
      return;
    }
    if (!this.preferredDate) {
      this.presentToast('Please select a preferred date');
      return;
    }
    if (!this.preferredTime) {
      this.presentToast('Please select a preferred time');
      return;
    }
    if (!this.location || !this.latitude || !this.longitude) {
      this.presentToast('Please select a location on the map');
      return;
    }

    try {
      // Format date and time
      const formattedDate = new Date(this.preferredDate).toISOString().split('T')[0];
      const formattedTime = this.preferredTime.split('T')[1].substring(0, 5);

      const bookingData = {
        service_type: this.serviceType,
        preferred_date: formattedDate,
        preferred_time: formattedTime,
        location: this.location,
        latitude: this.latitude,
        longitude: this.longitude,
        notes: this.notes,
        user_car_id: this.selectedCarId
      };

      console.log('Submitting booking with data:', bookingData);

      const bookingObservable = await this.bookingService.createBooking(bookingData);
      const response = await bookingObservable.toPromise();
      
      if (response && 'data' in response) {
        const bookingId = response.data.id;
        localStorage.setItem('currentBookingId', bookingId);
        this.presentToast('Booking created successfully');
        this.navCtrl.navigateForward('/payment');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      this.presentToast('Failed to create booking. Please try again.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
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
