import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Battery {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  specs: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  rating: number;
  category: 'all' | 'Emtrac' | 'Camel' | 'Asahi' | 'FBM Energy' | 'Tuflong' | 'Amaron' | 'Bosch' | 'Varta' | 'Hitec'
  | 'Century'
  | 'Sprinter' ;

}

@Component({
  selector: 'app-battery-shop',
  templateUrl: './batteryshop.page.html',
  styleUrls: ['./batteryshop.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class BatteryShopPage {
  selectedCategory: string = 'all'; // Sekarang untuk brand filter
  searchTerm: string = '';

  // Tukar kepada brand categories
  categories = [
    { id: 'all', name: 'All Brands' },
    { id: 'Emtrac', name: 'Emtrac'},
    { id: 'Camel', name: 'Camel'},
    { id: 'Asahi', name: 'Asahi'},
    { id: 'FBM Energy', name: 'FBM Energy'},
    { id: 'Tuflong', name: 'Tuflong'},
    { id: 'Amaron', name: 'Amaron' },
    { id: 'Bosch', name: 'Bosch'},
    { id: 'Varta', name: 'Varta'},
    { id: 'Hitec', name: 'Hitec'},
    { id: 'Century', name: 'Century'},
    { id: 'Sprinter', name: 'Sprinter'}
  ];

  batteries: Battery[] = [
    {
      id: 1,
      name: 'Century Pro NS60',
      brand: 'Century',
      price: 180,
      originalPrice: 220,
      image: '/assets/batteries/century.jpg',
      specs: '12V 45Ah',
      availability: 'in-stock',
      rating: 4.5,
      category: 'Century'
    },
    {
      id: 2,
      name: 'Amaron Go NS40ZL',
      brand: 'Amaron',
      price: 165,
      originalPrice: 185,
      image: '/assets/batteries/Amaron.png',
      specs: '12V 35Ah',
      availability: 'in-stock',
      rating: 4.4,
      category: 'Amaron'
    },
    {
      id: 3,
      name: 'Bosch S4 Silver',
      brand: 'Bosch',
      price: 195,
      image: '/assets/batteries/bosch.png',
      specs: '12V 50Ah',
      availability: 'in-stock',
      rating: 4.8,
      category: 'Bosch'
    },
    {
      id: 4,
      name: 'Varta Blue Dynamic',
      brand: 'Varta',
      price: 210,
      image: '/assets/batteries/varta.png',
      specs: '12V 60Ah',
      availability: 'low-stock',
      rating: 4.7,
      category: 'Varta'
    },
    {
      id: 5,
      name: 'Camel Active',
      brand: 'Camel',
      price: 175,
      image: '/assets/batteries/camel.png',
      specs: '12V 55Ah',
      availability: 'in-stock',
      rating: 4.3,
      category: 'Camel'
    },
    {
      id: 6,
      name: 'Emtrac Premium',
      brand: 'Emtrac',
      price: 160,
      originalPrice: 180,
      image: '/assets/batteries/emtrac.png',
      specs: '12V 45Ah',
      availability: 'in-stock',
      rating: 4.2,
      category: 'Emtrac'
    },
    {
      id: 7,
      name: 'Asahi Gold',
      brand: 'Asahi',
      price: 185,
      image: '/assets/batteries/asahi.png',
      specs: '12V 50Ah',
      availability: 'in-stock',
      rating: 4.6,
      category: 'Asahi'
    },
    {
      id: 8,
      name: 'FBM Energy Pro',
      brand: 'FBM Energy',
      price: 170,
      image: '/assets/batteries/fbm.png',
      specs: '12V 48Ah',
      availability: 'low-stock',
      rating: 4.1,
      category: 'FBM Energy'
    },
    {
      id: 9,
      name: 'Tuflong Super',
      brand: 'Tuflong',
      price: 190,
      image: '/assets/batteries/tuflong.png',
      specs: '12V 55Ah',
      availability: 'in-stock',
      rating: 4.5,
      category: 'Tuflong'
    },
    {
      id: 10,
      name: 'Hitec Power',
      brand: 'Hitec',
      price: 155,
      image: '/assets/batteries/hitec.png',
      specs: '12V 40Ah',
      availability: 'in-stock',
      rating: 4.0,
      category: 'Hitec'
    },
    {
      id: 11,
      name: 'Sprinter Racing',
      brand: 'Sprinter',
      price: 200,
      originalPrice: 230,
      image: '/assets/batteries/start.png',
      specs: '12V 65Ah',
      availability: 'in-stock',
      rating: 4.8,
      category: 'Sprinter'
    }
  ];

  constructor(private router: Router) {}

  get filteredBatteries() {
    const filtered = this.batteries.filter(battery => {
      // Filter by brand instead of category
      const matchesBrand = this.selectedCategory === 'all' || battery.brand === this.selectedCategory;
      let matchesSearch = true;
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const searchLower = this.searchTerm.toLowerCase().trim();
        matchesSearch = 
          battery.name.toLowerCase().includes(searchLower) ||
          battery.brand.toLowerCase().includes(searchLower) ||
          battery.specs.toLowerCase().includes(searchLower);
      }
      
      return matchesBrand && matchesSearch;
    });

    console.log('Filtered batteries:', filtered.length); // Debug log
    return filtered;
  }

  selectCategory(categoryId: string | undefined) {
    if (categoryId) {
      this.selectedCategory = categoryId;
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
  }

  getStockStatusColor(availability: string): string {
    switch (availability) {
      case 'in-stock': return 'success';
      case 'low-stock': return 'warning';
      case 'out-of-stock': return 'danger';
      default: return 'medium';
    }
  }

  getStockStatusText(availability: string): string {
    switch (availability) {
      case 'in-stock': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  }

  generateStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars;
  }

  buyNow(battery: Battery) {
    console.log('Buy now:', battery.name);
  }

goToCart() { this.router.navigate(['/cart']); }
goToAddToCart() { this.router.navigate(['/add-to-cart']); }

  goBack() {
    this.router.navigate(['/home']);
  }
}