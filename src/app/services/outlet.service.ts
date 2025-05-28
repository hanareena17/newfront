import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Outlet {
  id: string;
  name: string;
  address: string;
  contact: string;
  image_url: string;
  map_embed_code: string;
  district: string;
  google_maps_link: string;
  waze_link: string;
}

@Injectable({
  providedIn: 'root'
})
export class OutletService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Get all outlets
   */
  getAllOutlets(): Observable<{ status: string, data: Outlet[] }> {
    return this.http.get<{ status: string, data: Outlet[] }>(`${this.apiUrl}/outlets`);
  }

  /**
   * Get outlets by district
   */
  getOutletsByDistrict(districtId: string): Observable<{ status: string, data: Outlet[] }> {
    return this.http.get<{ status: string, data: Outlet[] }>(`${this.apiUrl}/districts/${districtId}/outlets`);
  }

  /**
   * Get outlet by id
   */
  getOutlet(id: string): Observable<{ status: string, data: Outlet }> {
    return this.http.get<{ status: string, data: Outlet }>(`${this.apiUrl}/outlets/${id}`);
  }
}