import { Component, OnInit } from '@angular/core';
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
  IonButtons

} from '@ionic/angular/standalone';

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
    IonSelectOption
  
  ]
})
export class BatteryshopPage implements OnInit {

filteredProducts: any[] = [];

constructor(private navCtrl: NavController) {}
  
  toggleLike(product: any) {
    product.liked = !product.liked;
  }
  sortProducts(criteria: string) {
    switch (criteria) {
      case 'priceLowHigh':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'ratingHighLow':
        this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
  }

  filterByBrand(brand: string) {
    if (brand === '' || brand === '.') {
      this.filteredProducts = [...this.popularProducts];
    } else {
      this.filteredProducts = this.popularProducts.filter(product => 
        product.name.toLowerCase().includes(brand.toLowerCase()));
    }
  }

  searchBatteries(event: any){
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.popularProducts.filter(product => 
      product.name.toLowerCase().includes(query)
    )
  }

  goToDetails(product: any) {
    this.navCtrl.navigateForward('/product-details', {
      state: { product }
    });
  }


  brands = [
    { name: '', icon: 'assets//.png' },
    { name: '', icon: 'assets//.png' },
    { name: '', icon: 'assets//.png' },
    { name: '', icon: 'assets//.png' },
    { name: '.', icon: 'assets//.png' },
  ];

  popularProducts = [
    {
      name: 'Amaron',
      image: 'assets/batteries/Amaron.png',
      price: 599.75,
      liked: true
    },
    {
      name: 'Bosch',
      image: 'assets/batteries/bosch.png',
      price: 699.75,
      liked: false
    },

    {
    name: 'FBM',
    image: 'assets/batteries/fbm.png',
    price: 699.75,
    liked: false
  },
    {
    name: 'Start',
    image: 'assets/batteries/start.png',
    price: 699.75,
    liked: false
  },

  {
    name: 'Tuflong',
    image: 'assets/batteries/tuflong.png',
    price: 699.75,
    liked: false
  },

  {
    name: 'Varta',
    image: 'assets/batteries/varta.png',
    price: 699.75,
    liked: false
  },

  ];

  ngOnInit(): void {
    this.filteredProducts = [...this.popularProducts];
  }
}
