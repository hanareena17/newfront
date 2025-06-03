import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Define a basic BatteryBrand interface
// You should expand this based on your actual battery brand data structure
export interface BatteryBrand {
  id: string; // Assuming UUID
  name: string;
  logo_url?: string;
  description?: string;
  country_of_origin?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Add any other relevant fields
}

@Injectable({
  providedIn: 'root'
})
export class BatteryBrandService {
  private apiUrl = `${environment.apiUrl}/battery_brands`; // Ensure this matches your API route

  constructor(private http: HttpClient) { }

  getBatteryBrands(): Observable<BatteryBrand[]> {
    return this.http.get<BatteryBrand[]>(this.apiUrl);
  }

  getBatteryBrandById(id: string): Observable<BatteryBrand> {
    return this.http.get<BatteryBrand>(`${this.apiUrl}/${id}`);
  }
}