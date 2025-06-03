import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Added HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service'; // Added AuthService
import { Product } from './product.service'; // Assuming you have a Product interface in product.service.ts

export interface CarProcessedDetail {
  car_id: string;
  car_model: string;
  matched_battery_size_id?: string;
  suggestions_count?: number;
  message?: string;
}

export interface BatterySuggestionResponse {
  message: string;
  suggestions?: Product[]; // Array of products
  cars_processed_details?: CarProcessedDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class BatterySuggestionService {
  private apiUrl = `${environment.apiUrl}/battery-suggestions`;

  constructor(private http: HttpClient, private authService: AuthService) { } // Injected AuthService

  getSuggestedBatteries(): Observable<BatterySuggestionResponse> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // This endpoint requires authentication
    return this.http.get<BatterySuggestionResponse>(this.apiUrl, { headers });
  }
}