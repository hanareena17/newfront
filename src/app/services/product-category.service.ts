import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductCategory {
  id: string; // Assuming UUID
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Add any other fields your API returns for product categories
}

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private apiUrl = `${environment.apiUrl}/product-categories`;

  constructor(private http: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.apiUrl);
  }

  getProductCategory(id: string): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(`${this.apiUrl}/${id}`);
  }
}