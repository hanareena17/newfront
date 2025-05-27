import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/profile`, {
      headers: this.getHeaders()
    });
  }

  updateProfile(profileData: any): Observable<any> {
    const formData = new FormData();
    
    // Append all profile data to FormData
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });

    return this.http.post(`${this.apiUrl}/user/profile`, formData, {
      headers: this.getHeaders()
    });
  }

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profile_image', file);

    return this.http.post(`${this.apiUrl}/user/profile`, formData, {
      headers: this.getHeaders()
    });
  }
} 