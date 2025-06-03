import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BatteryBrand } from './battery-brand.service'; // Assuming this exists or will be created
import { BatteryBrandSeries } from './battery-brand-series.service'; // Already created

// Define a basic Product interface
// You should expand this based on your actual product data structure
export interface Product {
  id: string; // Assuming UUID
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  image_url?: string; // Main image
  gallery_urls?: string[]; // Additional images
  product_category_id: string;
  battery_brand_id?: string;
  battery_brand_series_id?: string;
  battery_size_id?: string; // Important for matching
  battery_type_id?: string; // e.g., MF, EFB, AGM
  voltage?: string; // e.g., 12V
  capacity_ah?: number; // Ampere-hour
  cca?: number; // Cold Cranking Amps
  warranty_period_months?: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  weight_kg?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Relationships (optional, if your API returns them nested)
  battery_brand?: BatteryBrand;
  battery_brand_series?: BatteryBrandSeries;
  // Add any other relevant product fields
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Example: Get products by category
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category_id=${categoryId}`);
  }

  // Example: Get products by battery brand
  getProductsByBatteryBrand(brandId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?battery_brand_id=${brandId}`);
  }
}