import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// You might want to define these interfaces in a separate file (e.g., models.ts)
export interface CarBrand {
  id: string; // Assuming UUID
  name: string;
  // Add other properties as needed
}

export interface CarModel {
  id: string; // Assuming UUID
  name: string;
  car_brand_id: string;
  // Add other properties as needed
}

export interface UserCar {
  id: string; // Assuming UUID
  user_id: string;
  car_brand_id: string;
  car_model_id: string;
  license_plate: string;
  car_brand?: CarBrand; // Optional, if eager loaded
  car_model?: CarModel; // Optional, if eager loaded
  created_at?: string;
  updated_at?: string;
}

export interface NewUserCar {
  car_brand_id: string;
  car_model_id: string;
  license_plate: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  // Adjust this to your Laravel API endpoint
  private apiUrl = 'http://localhost:8000/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Helper to get authorization headers (if you use token-based auth)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Or however you store your auth token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCarBrands(): Observable<CarBrand[]> {
    return this.http.get<CarBrand[]>(`${this.apiUrl}/car-brands`) // Assuming this endpoint doesn't require auth
      .pipe(catchError(this.handleError));
  }

  getCarModels(brandId: string): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/car-brands/${brandId}/models`) // Assuming this endpoint doesn't require auth
      .pipe(catchError(this.handleError));
  }

  getUserCars(): Observable<UserCar[]> {
    return this.http.get<UserCar[]>(`${this.apiUrl}/user-cars`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  addUserCar(carData: NewUserCar): Observable<UserCar> {
    return this.http.post<UserCar>(`${this.apiUrl}/user-cars`, carData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Basic error handler
  private handleError(error: any) {
    console.error('An API error occurred', error);
    // You could transform the error into a user-friendly message
    return throwError(() => new Error('Something bad happened; please try again later. Details: ' + error.message));
  }
}
