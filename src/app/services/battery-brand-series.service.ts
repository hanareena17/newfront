import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BatteryBrandSeries {
  id: string; // Assuming UUID
  name: string;
  battery_brand_id: string;
  seq: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Add any other fields your API returns
}

@Injectable({
  providedIn: 'root'
})
export class BatteryBrandSeriesService {
  private apiUrl = `${environment.apiUrl}/battery-brand-series`;
  private batteryBrandApiUrl = `${environment.apiUrl}/battery-brands`; // For fetching series by brand

  constructor(private http: HttpClient) { }

  getBatteryBrandSeries(): Observable<BatteryBrandSeries[]> {
    return this.http.get<BatteryBrandSeries[]>(this.apiUrl);
  }

  getBatteryBrandSeriesById(id: string): Observable<BatteryBrandSeries> {
    return this.http.get<BatteryBrandSeries>(`${this.apiUrl}/${id}`);
  }

  getSeriesByBatteryBrand(batteryBrandId: string): Observable<BatteryBrandSeries[]> {
    return this.http.get<BatteryBrandSeries[]>(`${this.batteryBrandApiUrl}/${batteryBrandId}/battery-brand-series`);
  }
}