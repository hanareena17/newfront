import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';;
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonAvatar, IonButton, IonImg, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonIcon, IonSearchbar,
  IonFabButton, IonFab, IonItem, IonLabel, IonSpinner
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SafePropertyRead } from '@angular/compiler';
import { AuthService } from '../services/auth.service';
import { UserProfileService } from '../services/user-profile.service';
import { OutletService, Outlet } from '../services/outlet.service';
import { BatteryBrandService, BatteryBrand } from '../services/battery-brand.service'; // Removed Product
import { Product } from '../services/product.service'; // Added Product import from product.service


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonSpinner, IonContent,
    CommonModule, IonAvatar, IonButton, IonImg, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonIcon,
    IonSearchbar, IonFabButton, IonFab, IonItem, IonLabel
  ]
})
export class HomePage implements OnInit {
  user: any = {
    profile: {
      profile_image: 'assets/profile.png'
    },
    user: {
      name: 'Guest'
    },
    points: 0
  };
  
  promoBanner = '';
  loading = true;
  outletsLoading = false;
  outletsError: string | null = null;
  outlets: Outlet[] = [];
  public moved = false;

  batteriesLoading = false;
  batteriesError: string | null = null;
  batteryBrands: BatteryBrand[] = [];

  @ViewChild('chatBot', { static: false }) chatBotRef!: ElementRef;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private batteryService: BatteryBrandService,
    private outletService: OutletService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfileAndPoints();
    this.loadOutlets();
    this.loadBatteryBrands();
  }

  loadOutlets() {
    this.outletsLoading = true;
    this.outletsError = null;
    
    this.outletService.getAllOutlets()
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.outlets = response.data.slice(0, 4); // Get first 4 outlets for home page
            console.log('Outlets loaded:', this.outlets);
          }
        },
        error: (err) => {
          console.error('Error fetching outlets:', err);
          this.outletsError = 'Failed to load outlets';
          // Fallback to local data if API fails
          this.outlets = this.getLocalOutlets();
        },
        complete: () => {
          this.outletsLoading = false;
        }
      });
  }

  loadBatteryBrands() {
    this.batteriesLoading = true;
    this.batteriesError = null;
    
    this.batteryService.getBatteryBrands()
      .subscribe({
        next: (response: { status: string, data: BatteryBrand[] }) => {
          if (response.status === 'success') {
            this.batteryBrands = response.data.slice(0, 4);
            console.log('Battery Brands loaded:', this.batteryBrands);
          }
        },
        error: (err: any) => {
          console.error('Error fetching battery brands:', err);
          this.batteriesError = 'Failed to load battery brands';
          // Fallback to local data if API fails
          this.batteryBrands = this.getLocalBatteryBrands();
        },
        complete: () => {
          this.batteriesLoading = false;
        }
      });
  }

  async loadUserProfileAndPoints() {
    this.loading = true;
    try {
      const token = this.authService.getToken();
      if (!token) {
        console.log('No token found, cannot load profile or points.');
        this.user = { profile: { profile_image: null }, user: { name: 'Guest' }, points: 0 }; // Reset to guest, profile_image to null
        return;
      }

      // Fetch profile
      // Note: Using userProfileService if it's intended for profile fetching
      // For now, directly using http as in original code, but consider consolidating API calls in services
      const profileResponse = await this.http.get<any>(`${this.authService['apiUrl']}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).toPromise();
      
      if (profileResponse?.data) {
        this.user = {
          ...this.user, // Preserve existing structure like points
          ...profileResponse.data.user,
          ...profileResponse.data.profile,
        };
        console.log('User profile data set:', this.user);
      } else {
        // Handle case where profile data might be missing but user is logged in
         this.user.name = 'User'; // Fallback name
      }

      // Fetch points
      this.authService.getUserPoints().subscribe({
        next: (pointsResponse) => {
          this.user.points = pointsResponse.points;
          console.log('User points loaded:', this.user.points);
        },
        error: (pointsError) => {
          console.error('Error loading user points:', pointsError);
          this.user.points = 0; // Default to 0 on error
        }
      });

    } catch (error) {
      console.error('Error loading user profile and/or points:', error);
      // Potentially reset user to guest state or handle error appropriately
       this.user = { profile: { profile_image: null }, user: { name: 'Guest' }, points: 0 }; // profile_image to null
    } finally {
      this.loading = false;
    }
  }

  getProfileImage(): string | null {
    const img = this.user?.profile_image;
    if (img && img.trim() !== '' && img !== 'assets/profile.png') { // Also check against initial placeholder if any
      return img;
    }
    return null; // Return null if no specific image is set
  }

  // handleImageError is no longer needed if we use *ngIf on the img tag

  // Navigation methods
  navigateToAllOutlets() { this.router.navigate(['/outlets']); }
  goToProfile() { this.router.navigate(['/profile']); }
  goToBooking() { this.router.navigate(['/booking']); }
  goToRedeem() { this.router.navigate(['/redeem']); }
  goToTrackTechnician() { this.router.navigate(['/track-technician']); }
  goToCart() { this.router.navigate(['/cart']); }
  goToHistory() { this.router.navigate(['/history']); }
  goToBattery() { this.router.navigate(['/battery']); }

  goToBatteries() { this.router.navigate(['/batteries']); }
  goToBatteryShop() { this.router.navigate(['/batteryshop']); }


  goToChatBot() {
    console.log("Bot clicked!");
    this.router.navigate(['/chat-bot']);
  }

  handleBotClick() {
    if (!this.moved) {
      this.goToChatBot();
    }
  }

  startDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.moved = false;
  
    const isTouch = event.type === 'touchstart';
    const startX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
    const startY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
  
    const chatBotEl = this.chatBotRef.nativeElement as HTMLElement;
    const botWidth = chatBotEl.offsetWidth;
    const botHeight = chatBotEl.offsetHeight;
  
    const move = (e: MouseEvent | TouchEvent) => {
      const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
  
      const deltaX = Math.abs(clientX - startX);
      const deltaY = Math.abs(clientY - startY);
  
      if (deltaX > 10 || deltaY > 10) {
        this.moved = true;
  
        let left = clientX - botWidth / 2;
        let top = clientY - botHeight / 2;
  
        // prevent keluar dari screen
        left = Math.max(0, Math.min(left, window.innerWidth - botWidth));
        top = Math.max(0, Math.min(top, window.innerHeight - botHeight));
  
        chatBotEl.style.left = `${left}px`;
        chatBotEl.style.top = `${top}px`;
        chatBotEl.style.right = 'auto';
        chatBotEl.style.bottom = 'auto';
        chatBotEl.style.position = 'fixed';
      }
    };
  
    const end = () => {
      setTimeout(() => {
        document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', move);
        document.removeEventListener(isTouch ? 'touchend' : 'mouseup', end);
      }, 50);
    };
  
    document.addEventListener(isTouch ? 'touchmove' : 'mousemove', move);
    document.addEventListener(isTouch ? 'touchend' : 'mouseup', end);
  }

  
  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.chat-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
  

  
  // Fallback local data if API fails
  getLocalOutlets(): Outlet[] {
    return [
      {
        id: '1',
        name: 'TAMAN RINTING (HQ)',
        address: 'G01, KSL Avery Park, Jln Rinting, 81750 Masai, Johor',
        image_url: 'assets/outlets/taman_rinting.jpg',
        contact: '016-700 3200',
        map_embed_code: '',
        district: 'Masai',
        google_maps_link: '',
        waze_link: ''
      },
      {
        id: '2',
        name: 'MASAI',
        address: '1, Jalan Berkek, Taman Bunga Raya, 81750, Masai, Johor',
        image_url: 'assets/outlets/taman_bunga_raya.jpg',
        contact: '016-700 3200',
        map_embed_code: '',
        district: 'Masai',
        google_maps_link: '',
        waze_link: ''
      },
      {
        id: '3',
        name: 'SENGGARANG',
        address: 'No. 52, Jalan Ismail, Senggarang, 83200, Batu Pahat, Johor',
        image_url: 'assets/outlets/senggarang.jpg',
        contact: '016-700 3200',
        map_embed_code: '',
        district: 'Batu Pahat',
        google_maps_link: '',
        waze_link: ''
      },
      {
        id: '4',
        name: 'BANDAR PENAWAR',
        address: '25, Jln Jelutong 1, Taman Desaru Utama, 81930, Bandar Penawar, Johor',
        image_url: 'assets/outlets/bandar_penawar.jpg',
        contact: '016-700 3200',
        map_embed_code: '',
        district: 'Bandar Penawar',
        google_maps_link: '',
        waze_link: ''
      }
    ];
  }

  getLocalBatteryBrands(): BatteryBrand[] {
    return [
      {
        id: '1',
        name: 'AMARON',
        image_url: 'https://example.com/images/batteries/amaron.png',
        seq: 1
      },
      {
        id: '2',
        name: 'FBM ENERGY',
        image_url: 'https://example.com/images/batteries/fbm.png',
        seq: 2
      },
      {
        id: '3',
        name: 'VARTA',
        image_url: 'https://example.com/images/batteries/varta.png',
        seq: 3
      },
      {
        id: '4',
        name: 'BOSCH',
        image_url: 'https://example.com/images/batteries/bosch.png',
        seq: 4
      }
    ];
  }
}
