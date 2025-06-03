import { Component, OnInit, inject } from '@angular/core'; // Added inject
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonChip,
  IonAvatar,
  IonImg,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonItem,
  IonSelect,
  IonBackButton,
  IonSelectOption,
  IonButtons,
  IonSpinner, // Added IonSpinner for loading states
  IonList, IonListHeader, IonText // Added for suggestions
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; // For adding icons
import { star, starOutline, heart, heartOutline, searchOutline, filterOutline, pricetagOutline } from 'ionicons/icons'; // Example icons

// Services
import { ProductService, Product } from '../services/product.service';
import { BatteryBrandService, BatteryBrand } from '../services/battery-brand.service';
import { ProductCategoryService, ProductCategory } from '../services/product-category.service';
import { BatterySuggestionService, BatterySuggestionResponse } from '../services/battery-suggestion.service';
import { AuthService } from '../services/auth.service'; // Assuming you have an AuthService to check login status
import { environment } from '../../environments/environment'; // Import environment

@Component({
  selector: 'app-batteryshop',
  templateUrl: './batteryshop.page.html',
  styleUrls: ['./batteryshop.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonChip,
    IonAvatar,
    IonImg,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButton,
    IonItem,
    IonSelect,
    IonBackButton,
    IonButtons,
    IonSelectOption,
    IonSpinner, // Added
    IonList, IonListHeader, IonText // Added
  ]
})
export class BatteryshopPage implements OnInit {
  private productService = inject(ProductService);
  private batteryBrandService = inject(BatteryBrandService);
  private productCategoryService = inject(ProductCategoryService);
  private batterySuggestionService = inject(BatterySuggestionService);
  public authService = inject(AuthService); // Made public for template access
  private navCtrl = inject(NavController);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  suggestedProducts: Product[] = [];
  batteryBrands: BatteryBrand[] = [];
  productCategories: ProductCategory[] = [];

  isLoadingProducts = false;
  isLoadingSuggestions = false;
  isLoadingBrands = false;
  isLoadingCategories = false;

  selectedBrandId: string | null = null;
  selectedCategoryId: string | null = null;
  searchTerm = '';

  // For liked products, you might want to persist this, e.g., in localStorage or a user service
  likedProductIds = new Set<string>();

  constructor() {
    addIcons({ star, starOutline, heart, heartOutline, searchOutline, filterOutline, pricetagOutline });
  }

  ngOnInit(): void {
    this.loadInitialData();
    // Corrected: Call isAuthenticated directly
    if (this.authService.isAuthenticated()) {
      this.loadBatterySuggestions();
    }
  }

  loadInitialData() {
    this.loadBatteryBrands();
    this.loadProductCategories();
    this.loadAllProducts(); // Load all products initially or based on a default filter
  }

  loadAllProducts() {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (productsResponse: any) => { // Added :any for now, consider a proper interface
        if (productsResponse && Array.isArray(productsResponse.data)) {
          this.allProducts = productsResponse.data;
        } else if (Array.isArray(productsResponse)) { // Fallback for direct array
          this.allProducts = productsResponse;
        }
        else {
          console.error('Error: Products response is not in the expected format or data is not an array.', productsResponse);
          this.allProducts = []; // Default to empty array to prevent further errors
        }
        this.applyFilters(); // Apply initial filters (if any) or show all
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoadingProducts = false;
        // Handle error display to user
      }
    });
  }

  loadBatterySuggestions() {
    this.isLoadingSuggestions = true;
    this.batterySuggestionService.getSuggestedBatteries().subscribe({
      next: (response: BatterySuggestionResponse) => {
        this.suggestedProducts = response.suggestions || [];
        this.isLoadingSuggestions = false;
      },
      error: (err) => {
        console.error('Error loading battery suggestions:', err);
        this.isLoadingSuggestions = false;
        // Handle error (e.g., user not logged in, no suggestions)
      }
    });
  }

  loadBatteryBrands() {
    this.isLoadingBrands = true;
    this.batteryBrandService.getBatteryBrands().subscribe({
      next: (brandsResponse: any) => { // Added :any for now, consider a proper interface
        if (brandsResponse && Array.isArray(brandsResponse.data)) {
          this.batteryBrands = brandsResponse.data.sort((a: BatteryBrand, b: BatteryBrand) => a.name.localeCompare(b.name));
        } else if (Array.isArray(brandsResponse)) { // Fallback for direct array
           this.batteryBrands = brandsResponse.sort((a: BatteryBrand, b: BatteryBrand) => a.name.localeCompare(b.name));
        }
        else {
          console.error('Error: Battery brands response is not in the expected format or data is not an array.', brandsResponse);
          this.batteryBrands = []; // Default to empty array
        }
        this.isLoadingBrands = false;
      },
      error: (err) => {
        console.error('Error loading battery brands:', err);
        this.isLoadingBrands = false;
      }
    });
  }

  loadProductCategories() {
    this.isLoadingCategories = true;
    this.productCategoryService.getProductCategories().subscribe({
      next: (categoriesResponse: any) => { // Added :any for now, consider a proper interface
        if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
          this.productCategories = categoriesResponse.data.sort((a: ProductCategory, b: ProductCategory) => a.name.localeCompare(b.name));
        } else if (Array.isArray(categoriesResponse)) { // Fallback for direct array
          this.productCategories = categoriesResponse.sort((a: ProductCategory, b: ProductCategory) => a.name.localeCompare(b.name));
        }
         else {
          console.error('Error: Product categories response is not in the expected format or data is not an array.', categoriesResponse);
          this.productCategories = []; // Default to empty array
        }
        this.isLoadingCategories = false;
      },
      error: (err) => {
        console.error('Error loading product categories:', err);
        this.isLoadingCategories = false;
      }
    });
  }

  applyFilters() {
    let productsToFilter = [...this.allProducts];

    if (this.selectedBrandId) {
      productsToFilter = productsToFilter.filter(p => p.battery_brand_id === this.selectedBrandId);
    }

    if (this.selectedCategoryId) {
      productsToFilter = productsToFilter.filter(p => p.product_category_id === this.selectedCategoryId);
    }

    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      productsToFilter = productsToFilter.filter(p =>
        p.name.toLowerCase().includes(lowerSearchTerm) ||
        (p.description && p.description.toLowerCase().includes(lowerSearchTerm)) ||
        (p.battery_brand?.name && p.battery_brand.name.toLowerCase().includes(lowerSearchTerm))
      );
    }
    this.filteredProducts = productsToFilter;
  }


  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  onBrandChange(event: any) {
    this.selectedBrandId = event.detail.value || null;
    this.applyFilters();
  }
  
  onCategoryChange(event: any) {
    this.selectedCategoryId = event.detail.value || null;
    this.applyFilters();
  }

  clearBrandFilter() {
    this.selectedBrandId = null;
    this.applyFilters();
  }

  clearCategoryFilter() {
    this.selectedCategoryId = null;
    this.applyFilters();
  }
  
  sortProducts(criteria: string) {
    switch (criteria) {
      case 'priceLowHigh':
        this.filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceHighLow':
        this.filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      // Add other sorting criteria like rating if available in Product interface
      // case 'ratingHighLow':
      //   this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      //   break;
      case 'nameAZ':
        this.filteredProducts.sort((a,b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        this.filteredProducts.sort((a,b) => b.name.localeCompare(a.name));
        break;
    }
  }

  toggleLike(product: Product) {
    if (this.likedProductIds.has(product.id)) {
      this.likedProductIds.delete(product.id);
    } else {
      this.likedProductIds.add(product.id);
    }
    // Persist likedProductIds if necessary
  }

  isLiked(productId: string): boolean {
    return this.likedProductIds.has(productId);
  }

  goToDetails(product: Product) {
    this.navCtrl.navigateForward('/product-details', {
      state: { product }
    });
  }

  // Helper to get brand logo, can be used in template
  getBrandLogo(brandId?: string): string | undefined {
    if (!brandId) return undefined;
    const brand = this.batteryBrands.find(b => b.id === brandId);
    return brand?.logo_url || 'assets/icon/favicon.png'; // Fallback icon
  }

  getProductImageUrl(imageUrl?: string): string {
    if (!imageUrl) {
      return 'assets/icon/favicon.png'; // Default fallback
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl; // Already a full URL
    }
    // Assuming API URL is like 'http://127.0.0.1:8000/api', we want 'http://127.0.0.1:8000/'
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl}`;
  }
}
