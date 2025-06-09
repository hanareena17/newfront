import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonIcon, IonButtons, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import * as L from 'leaflet';
import { addIcons } from 'ionicons';
import { locationOutline, checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, IonIcon, CommonModule, FormsModule, IonButtons, IonFab, IonFabButton ]
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private defaultLat = 3.1390;  // Kuala Lumpur coordinates
  private defaultLng = 101.6869;
  private selectedLocation: { lat: number; lng: number; address: string } | null = null;
  private bookingId: string | null = null;
  private iconDefault: L.Icon;
  private watchId: number | null = null;

  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService,
    private bookingService: BookingService
  ) {
    addIcons({ locationOutline, checkmarkOutline });
    // Configure default marker icon using CDN
    this.iconDefault = L.icon({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = this.iconDefault;
  }

  ngOnInit() {
    this.bookingId = localStorage.getItem('currentBookingId');
  }

  ngAfterViewInit() {
    // Wait for the view to be ready
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    // Initialize map
    this.map = L.map('map').setView([this.defaultLat, this.defaultLng], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Get current location
    if (navigator.geolocation) {
      // First, try to get the current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map?.setView([lat, lng], 13);
          this.addMarker(lat, lng);
          this.getAddress(lat, lng);

          // Then start watching position
          this.startWatchingPosition();
        },
        (error) => {
          console.error('Error getting location:', error);
          this.addMarker(this.defaultLat, this.defaultLng);
          this.getAddress(this.defaultLat, this.defaultLng);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.addMarker(this.defaultLat, this.defaultLng);
      this.getAddress(this.defaultLat, this.defaultLng);
    }

    // Add click event to map
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.addMarker(e.latlng.lat, e.latlng.lng);
      this.getAddress(e.latlng.lat, e.latlng.lng);
    });
  }

  private startWatchingPosition() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Only update if marker is not being dragged
          if (this.marker && !this.marker.dragging) {
            this.marker.setLatLng([lat, lng]);
            this.getAddress(lat, lng);
          }
        },
        (error) => {
          console.error('Error watching position:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }

  private addMarker(lat: number, lng: number) {
    if (this.marker) {
      this.map?.removeLayer(this.marker);
    }

    // Create draggable marker
    this.marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(this.map!);

    // Add drag end event
    this.marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      this.getAddress(position.lat, position.lng);
    });

    this.selectedLocation = { lat, lng, address: '' };
  }

  private async getAddress(lat: number, lng: number) {
    try {
      const response = await this.http.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      ).toPromise();

      if (response && 'display_name' in response) {
        const address = (response as any).display_name;
        this.selectedLocation = { lat, lng, address };
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  }

  async confirmLocation() {
    if (!this.selectedLocation) {
      this.presentAlert('Error', 'Please select a location on the map');
      return;
    }

    try {
      // Save location to localStorage with timestamp
      const locationData = {
        ...this.selectedLocation,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('selectedLocation', JSON.stringify(locationData));

      // If there's a booking ID, update the booking location
      if (this.bookingId) {
        const updateObservable = await this.bookingService.updateBookingLocation(
          this.bookingId,
          this.selectedLocation.lat,
          this.selectedLocation.lng
        );
        await updateObservable.toPromise();
      }

      this.presentAlert('Success', 'Location saved successfully');
      this.navCtrl.navigateBack('/booking');
    } catch (error) {
      console.error('Error saving location:', error);
      this.presentAlert('Error', 'Failed to save location. Please try again.');
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

  ngOnDestroy() {
    // Stop watching position when component is destroyed
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
}



