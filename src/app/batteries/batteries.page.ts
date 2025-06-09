import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonCardContent, IonCard, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { BatteryBrandService, BatteryBrand } from '../services/battery-brand.service';
import { ProductService, Product } from '../services/product.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-batteries',
  templateUrl: './batteries.page.html',
  styleUrls: ['./batteries.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonButton, IonToolbar, CommonModule, FormsModule, IonCardContent, IonCard, IonSpinner, IonIcon]
})
export class BatteriesPage implements OnInit {
  batteryBrands: BatteryBrand[] = [];
  productsByBrand: { [brandId: string]: Product[] } = {};
  loading: boolean = false;
  error: string | null = null;

  
  constructor(
    private router: Router,
    private batteryService: BatteryBrandService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadBatteryBrands();
  }

  loadBatteryBrands() {
    this.loading = true;
    this.error = null;
    
    this.batteryService.getBatteryBrands()
      .pipe(
        catchError(err => {
          console.error('Error fetching battery brands:', err);
          this.error = 'Failed to load batteries. Please try again later.';
          return of({ status: 'error', data: [] });
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(response => {
        if (response.status === 'success') {
          this.batteryBrands = response.data;
          this.loadProductsForBrands();
        }
      });
  }

  loadProductsForBrands() {
    this.batteryBrands.forEach(brand => {
      this.productService.getProductsByBatteryBrand(brand.id)
        .subscribe({
          next: (response: { status: string, data: Product[] }) => {
            if (response.status === 'success') {
              this.productsByBrand[brand.id] = response.data;
            }
          },
          error: (err) => {
            console.error(`Error loading products for brand ${brand.name}:`, err);
            this.productsByBrand[brand.id] = [];
          }
        });
    });
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['/product-details'], { state: { product } });
  }

  getBrandImage(brand: BatteryBrand): string {
    return brand.image_url || 'https://example.com/images/batteries/default.png';
  }

  retryLoad() {
    this.loadBatteryBrands();
  }
}

