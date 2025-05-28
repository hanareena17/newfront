import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonCardContent, IonCard, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OutletService, Outlet } from '../services/outlet.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.page.html',
  styleUrls: ['./outlets.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonButton, IonToolbar, CommonModule, FormsModule, IonCardContent, IonCard, IonSpinner]
})
export class OutletsPage implements OnInit {
  outlets: Outlet[] = [];
  outletsByDistrict: { [district: string]: Outlet[] } = {};
  districts: string[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private outletService: OutletService
  ) {}

  ngOnInit() {
    this.loadOutlets();
  }

  loadOutlets() {
    this.loading = true;
    this.error = null;
    
    this.outletService.getAllOutlets()
      .pipe(
        catchError(err => {
          console.error('Error fetching outlets:', err);
          this.error = 'Failed to load outlets. Please try again later.';
          return of({ status: 'error', data: [] });
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(response => {
        if (response.status === 'success') {
          this.outlets = response.data;
          
          // Group outlets by district
          this.groupOutletsByDistrict();
          
          // Store in localStorage for offline access
          localStorage.setItem('outlets', JSON.stringify(this.outlets));
        }
      });
  }

  groupOutletsByDistrict() {
    this.outletsByDistrict = {};
    
    // Group outlets by district
    this.outlets.forEach(outlet => {
      if (!this.outletsByDistrict[outlet.district]) {
        this.outletsByDistrict[outlet.district] = [];
      }
      this.outletsByDistrict[outlet.district].push(outlet);
    });
    
    // Get sorted district names
    this.districts = Object.keys(this.outletsByDistrict).sort();
  }

  openWaze(outlet: Outlet) {
    if (outlet.waze_link) {
      window.open(outlet.waze_link, '_blank');
    }
  }

  openGoogleMaps(outlet: Outlet) {
    if (outlet.google_maps_link) {
      window.open(outlet.google_maps_link, '_blank');
    }
  }
}
