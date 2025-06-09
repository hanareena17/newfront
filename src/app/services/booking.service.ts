import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Booking {
  id: string;
  user_id: string;
  user_car_id: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  location: string;
  latitude: number;
  longitude: number;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  async createBooking(bookingData: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/bookings`, bookingData, { headers });
  }

  async getBookings(): Promise<Observable<Booking[]>> {
    const headers = await this.getHeaders();
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`, { headers });
  }

  async getBooking(id: string): Promise<Observable<Booking>> {
    const headers = await this.getHeaders();
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`, { headers });
  }

  async updateBookingLocation(bookingId: string, latitude: number, longitude: number): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.patch(`${this.apiUrl}/bookings/${bookingId}/location`, {
      latitude,
      longitude
    }, { headers });
  }
} 