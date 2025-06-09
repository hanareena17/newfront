import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from './product.service';

// Define a basic BatteryBrand interface
// You should expand this based on your actual battery brand data structure
export interface BatteryBrand {
  id: string; // Assuming UUID
  name: string;
  image_url: string;
  seq: number;
  // description?: string;
  // country_of_origin?: string;
  // is_active: boolean;
  // created_at: string;
  // updated_at: string;
  // deleted_at?: string | null;
  // Add any other relevant fields
}

@Injectable({
  providedIn: 'root'
})
export class BatteryBrandService {
  // private apiUrl = `${environment.apiUrl}/battery_brands`; // Ensure this matches your API route
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBatteryBrands(): Observable<{ status: string, data: BatteryBrand[] }> {
    return this.http.get<{ status: string, data: BatteryBrand[] }>(`${this.apiUrl}/battery_brands`);
  }

  getProductsByBrand(brandId: string): Observable<{ status: string, data: Product[] }> {
    return this.http.get<{ status: string, data: Product[] }>(`${this.apiUrl}/battery_brands/${brandId}/products`);
  }

  getBatteryBrand(id: string): Observable<{ status: string, data: BatteryBrand }> {
    return this.http.get<{ status: string, data: BatteryBrand }>(`${this.apiUrl}/battery_brands/${id}`);
  }
}