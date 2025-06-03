import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonCardContent, IonCard, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { BatteryBrandService, BatteryBrand } from '../services/battery-brand.service';
import { ProductService, Product } from '../services/product.service'; // Updated Product import and added ProductService
import { catchError, finalize, tap } from 'rxjs/operators'; // Added tap
import { forkJoin, of } from 'rxjs'; // Added forkJoin
import { environment } from 'src/environments/environment';

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
  loadingProducts: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private batteryService: BatteryBrandService,
    private productService: ProductService // Injected ProductService
  ) {}

  ngOnInit() {
    this.loadBatteryBrandsAndTheirProducts();
  }

  loadBatteryBrandsAndTheirProducts() {
    this.loading = true;
    this.error = null;
    this.batteryService.getBatteryBrands().pipe(
      tap(brands => {
        // Sort by name if needed, as seq is not available in the new interface
        this.batteryBrands = brands.sort((a, b) => a.name.localeCompare(b.name));
        console.log('Battery brands loaded:', this.batteryBrands);
      }),
      catchError(err => {
        console.error('Error fetching battery brands:', err);
        this.error = 'Failed to load battery brands. Using local fallback.';
        this.batteryBrands = this.getLocalBatteryBrands(); // Use fallback
        return of(this.batteryBrands); // Continue with fallback data
      }),
      finalize(() => {
        // Even if brands fail, try to load products if any brands (e.g. fallback) exist
        if (this.batteryBrands.length > 0) {
          this.loadProductsForAllBrands();
        } else {
          this.loading = false; // Nothing to load
        }
      })
    ).subscribe();
  }

  loadProductsForAllBrands() {
    if (this.batteryBrands.length === 0) {
      this.loadingProducts = false;
      this.loading = false; // Ensure main loading is also false
      return;
    }

    this.loadingProducts = true;
    const productRequests = this.batteryBrands.map(brand =>
      this.productService.getProductsByBatteryBrand(brand.id).pipe(
        tap(products => {
          this.productsByBrand[brand.id] = products;
          console.log(`Products loaded for ${brand.name}:`, products);
        }),
        catchError(err => {
          console.error(`Error fetching products for brand ${brand.name}:`, err);
          this.productsByBrand[brand.id] = []; // Set empty array on error
          return of([]); // Continue with other requests
        })
      )
    );

    forkJoin(productRequests).pipe(
      finalize(() => {
        this.loadingProducts = false;
        this.loading = false; // All loading finished
      })
    ).subscribe();
  }

  navigateToBrand(brand: BatteryBrand) {
    // Navigate to brand detail page or products page for specific brand
    // Consider passing state or query params if needed
    this.router.navigate(['/products'], { queryParams: { brandId: brand.id, brandName: brand.name } });
  }

  navigateToProduct(product: Product) {
    // Navigate to product detail page
    this.router.navigate(['/product-details'], { state: { product } });
  }

  getBrandImage(brand: BatteryBrand): string {
    if (!brand.logo_url) { // Changed from image to logo_url
      return 'assets/batteries/default.png'; // Provide a default image
    }
    // If the logo_url is already a full URL, return it as is
    if (brand.logo_url.startsWith('http')) {
      return brand.logo_url;
    }
    // Assuming logo_url might be a relative path from assets
    return brand.logo_url; // Or prepend with assets path if necessary: `assets/${brand.logo_url}`
  }

  getProductsCount(brandId: string): number {
    return this.productsByBrand[brandId]?.length || 0;
  }

  hasProducts(brandId: string): boolean {
    return this.getProductsCount(brandId) > 0;
  }

  // Fallback local data if API fails
  getLocalBatteryBrands(): BatteryBrand[] {
    return [
      {
        id: '1', // Ensure these IDs are strings if your interface expects strings
        name: 'AMARON',
        logo_url: 'assets/batteries/Amaron.png', // Changed to logo_url, removed seq
        is_active: true, // Added is_active to match interface
        created_at: new Date().toISOString(), // Added dummy data
        updated_at: new Date().toISOString()  // Added dummy data
      },
      {
        id: '2',
        name: 'FBM ENERGY',
        logo_url: 'assets/batteries/fbm.png',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'VARTA',
        logo_url: 'assets/batteries/varta.png',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'BOSCH',
        logo_url: 'assets/batteries/bosch.png',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  retryLoad() {
    this.loadBatteryBrandsAndTheirProducts(); // Call the combined method
  }
}

