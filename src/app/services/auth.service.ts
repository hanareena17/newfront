import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = 'http://127.0.0.1:8000/api'; // Changed to public

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        localStorage.removeItem('token');
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserPoints(): Observable<{ points: number }> {
    const token = this.getToken();
    return this.http.get<{ points: number }>(`${this.apiUrl}/user/points`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getRewards(): Observable<any[]> { // Define a proper interface for RewardItem later
    return this.http.get<any[]>(`${this.apiUrl}/rewards`);
  }
}