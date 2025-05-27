import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';;
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonAvatar, IonButton, IonImg, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonIcon, IonSearchbar,
  IonFabButton, IonFab, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SafePropertyRead } from '@angular/compiler';
import { AuthService } from '../services/auth.service';
import { UserProfileService } from '../services/user-profile.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
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
  public moved = false;

  @ViewChild('chatBot', { static: false }) chatBotRef!: ElementRef;

  constructor(private http: HttpClient, 
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router) {}

  // onBotClicked() {
  //   if (!this.moved) {
  //     this.goToChatBot();
  //   }
  // }

  
  ngOnInit() {
    this.loadUserProfileAndPoints();
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
  // goToChatBot() {
  //   console.log("Bot clicked!");
  //   this.router.navigate(['/chat-bot']);
  // }

  // Draggable Chatbot
  // startDrag(event: MouseEvent | TouchEvent) {
  //   event.preventDefault();
  //   this.moved = false;

  //   const isTouch = event.type === 'touchstart';
  //   const initialX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
  //   const initialY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
  
  //   const chatBotEl = this.chatBotRef.nativeElement as HTMLElement;
  //   const botWidth = chatBotEl.offsetWidth;
  //   const botHeight = chatBotEl.offsetHeight;
  
  //   const move = (e: MouseEvent | TouchEvent) => {
  //     this.moved = true; // Only set if actual movement
  //     const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
  //     const clientY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      
  //   const deltaX = Math.abs(clientX - initialX);
  //   const deltaY = Math.abs(clientY - initialY);

  
  //   if (deltaX > 5 || deltaY > 5) {
     
  //   }

  //     // Dapatkan dimensi skrin
  //     const screenWidth = window.innerWidth;
  //     const screenHeight = window.innerHeight;
  
  //     // Kira posisi baru
  //     let left = clientX - botWidth / 2;
  //     let top = clientY - botHeight / 2;
  
  //     // Pastikan tak keluar dari skrin
  //     left = Math.max(0, Math.min(left, window.innerWidth - botWidth));
  //     top = Math.max(0, Math.min(top, window.innerHeight - botHeight));
  
  //     chatBotEl.style.left = `${left}px`;
  //     chatBotEl.style.top = `${top}px`;
  //     chatBotEl.style.right = 'auto';
  //     chatBotEl.style.bottom = 'auto';
  //     chatBotEl.style.position = 'fixed';
  //   };

  //   const end = () => {
  //     document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', move);
  //     document.removeEventListener(isTouch ? 'touchend' : 'mouseup', end);
  //   };
  
  //   document.addEventListener(isTouch ? 'touchmove' : 'mousemove', move);
  //   document.addEventListener(isTouch ? 'touchend' : 'mouseup', end);
  // }

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
  

  
  outlets = [
    { name: 'TAMAN RINTING (HQ)', address: 'G01, KSL Avery Park, Jln Rinting, 81750 Masai, Johor', img: 'assets/outlets/taman_rinting.jpg' },
    { name: 'MASAI', address: '1, Jalan Berkek, Taman Bunga Raya, 81750, Masai, Johor', img: 'assets/outlets/taman_bunga_raya.jpg' },
    { name: 'SENGGARANG', address: 'No. 52, Jalan Ismail, Senggarang, 83200, Batu Pahat, Johor', img: 'assets/outlets/senggarang.jpg' },
    { name: 'BANDAR PENAWAR', address: '25, Jln Jelutong 1, Taman Desaru Utama, 81930, Bandar Penawar, Johor', img: 'assets/outlets/bandar_penawar.jpg' },
    { name: 'AYER HITAM', address: 'No.102, Jalan Batu Pahat, Taman Air Hitam, 86100 Ayer Hitam, Johor', img: 'assets/outlets/ayer_hitam.jpg' },
    { name: 'BANDAR SERI ALAM', address: '28-A, Jalan Suria 67, Bandar Seri Alam, 81750 Masai, Johor', img: 'assets/outlets/bandar_seri_alam.jpg' },
    { name: 'BATU PAHAT HQ', address: 'No.21, Jalan Murni 11, Taman Murni, 83000 Batu Pahat, Johor', img: 'assets/outlets/bp_hq.jpg' },
    { name: 'TAMAN ADDA HEIGHTS', address: 'No 32, Adda 8/1, Taman Adda, 81100 Johor Bahru, Johor', img: 'assets/outlets/adda_height.jpg' },
    { name: 'BENUT', address: 'No 3, Jalan Mutiara 3, Pusat Perniagaan Benut, 82000 Pontian, Johor', img: 'assets/outlets/benut.jpg' },
    { name: 'KOTA MASAI', address: 'No 35, Jalan Mangga 1, Taman Kota Masai, 81700 Pasir Gudang, Johor', img: 'assets/outlets/taman_kota_masai.jpg' },
    { name: 'SIMPANG RENGGAM', address: '76B, Jalan Besar, Simpang Renggam, 86200 Simpang Renggam, Johor', img: 'assets/outlets/simpang_renggam.jpg' },
    { name: 'BUKIT GAMBIR', address: 'No.115, Jalan Gambir 8, Bandar Baru Bukit Gambir, 8', img: 'assets/outlets/bukit_gambir.jpg' },
    { name: 'KLUANG', address: 'No.513, Jalan Mersing, Kluang Baru, 86000 Kluang, Johor', img: 'assets/outlets/kluang.jpg' },
    { name: 'ENDAU', address: 'No.4096, Jalan Perisai 3, Bandar Baru, 86900 Endau, Johor', img: 'assets/outlets/endau.jpg' },
    { name: 'TONGKANG PECAH', address: 'No.4, Jalan Bistari Utama, Tongkang Pechah, 83010, Batu Pahat, Johor', img: 'assets/outlets/tongkang_pecah.jpg' },
    { name: 'MOUNT AUSTIN', address: '6-71,Jalan Mutiara Emas 10/2, Taman Mount Austin, 81100 Johor Bahru, Johor', img: 'assets/outlets/mount_austin.jpg' },
    { name: 'KOTA PUTERI', address: 'G-02 Blok H, Jalan Jelatang 27, Taman Cahaya Kota Puteri, 81750, Johor Bahru, Johor', img: 'assets/outlets/kota_puteri.jpg' },
    { name: 'TAMAN IMPIAN EMAS', address: 'No 19, Jalan Anggerik Emas 1, Taman Impian Emas, 81200 Johor Bahru, Johor', img: 'assets/outlets/taman_impian_emas.jpg' },
    { name: 'GELANG PATAH', address: '09-01, Jln Nusaria 11/5, Taman Nusantara, 81550 Johor Bahru, Johor', img: 'assets/outlets/gelang_patah.png' },
    { name: 'TAMAN PERLING', address: '260, Jalan Persisiran Perling 1, Taman Perling, 81200 Johor Bahru,  Johor', img: 'assets/outlets/taman_perling.jpg' },
    { name: 'KULAI', address: '6, Jalan Gangsa 1, Taman Gunung Pulai, 81000 Kulai, Johor', img: 'assets/outlets/kulai.jpg' },
    { name: 'CAHAYA MASAI', address: 'No 21, Jalan Intan 13, Taman Cahaya Masai, 81700 Pasir Gudang, Johor', img: 'assets/outlets/taman_cahaya_masai.jpg' },
    { name: 'YONG PENG', address: '57-G, Jalan Kota, Taman Kota, 83700 Yong Peng, Johor', img: 'assets/outlets/yong_peng.jpg' },
    { name: 'SEGAMAT', address: 'No.301D, Jalan Sia Her Yam, Kampung Abdullah, 85000 Segamat, Johor', img: 'assets/outlets/segamat.jpg' },
    { name: 'TAMAN TERATAI', address: 'No.10, Jalan Enau 15, Taman Teratai, 81300 Skudai, Johor', img: 'assets/outlets/taman_teratai.jpg' },
    { name: 'TAMAN BUKIT DAHLIA', address: 'No  24, Jalan Sejambak 14, Taman Bukit Dahlia, 81700 Pasir Gudang, Johor', img: 'assets/outlets/taman_bukit_dahlia.jpg' },
    { name: 'PARIT JAWA', address: 'LC-62, Parit Raja, Batu Pahat, 86400, Batu Pahat, Johor', img: 'assets/outlets/parit_raja.jpg' },
    { name: 'PUSAT PERDAGANGAN KOTA TINGGI', address: 'L11A, Jalan Tun Sri Lanang, Pusat Perdagangan Kota Tinggi, 81900, Kota Tinggi, Johor', img: 'assets/outlets/pp_kota_tinggi.jpg' },
    { name: 'MERSING', address: '91-3,Jalan Jemaluang, Mersing,  86800 Mersing, Johor', img: 'assets/outlets/mersing.jpg' },
    { name: 'KAMPUNG MELAYU MAJIDEE', address: '2D-LP, Off Jalan Utama, Kampung Melayu Majidee, 81100 Johor Bahru, Johor', img: 'assets/outlets/kg_majidee.jpg' },
    { name: 'TAMAN SCIENTEX', address: '34A, Jalan Belatuk 3, Taman Scientex, 81700 Pasir Gudang, Johor', img: 'assets/outlets/taman_scientex.jpg' },
    { name: 'TAMAN UNIVERSITI', address: 'No.24, Jalan Kebudayaan 5, Taman Universiti, 81300 Skudai, Johor', img: 'assets/outlets/taman_universiti.jpg' },
    { name: 'PARIT JAWA', address: 'No.135, Jalan Omar, Parit Jawa, 84150 Muar, Johor', img: 'assets/outlets/parit_jawa.jpg' },
    { name: 'KOTA TINGGI', address: 'Lot A & Lot B. 8M & 8L, Jalan Tun Habab, Bandar Kota Tinggi, 81900, Kota Tinggi, Johor', img: 'assets/outlets/kota_tinggi.jpg' },
    { name: 'TAMAN CEMPAKA', address: 'No 5, Cengkerik 6,Pusat Perdagangan Kempas, 81100 Johor Bahru, Johor', img: 'assets/outlets/taman_cempaka.jpg' },
    { name: 'PULAI MUTIARA', address: 'No. 24, Jalan Pulai Mutiara 4/7, Persiaran Taman Pulai Mutiara, 81300 Skudai, Johor', img: 'assets/outlets/pulai_mutiara.jpg' },
  ];

  batteries = [
    { name: 'AMARON', img: 'assets/batteries/Amaron.png' },
    { name: 'FBM ENERGY', img: 'assets/batteries/fbm.png' },
    { name: 'VARTA', img: 'assets/batteries/varta.png' },
    { name: 'START', img: 'assets/batteries/start.png' },
    { name: 'BOSCH', img: 'assets/batteries/bosch.png' },
    { name: 'TUFLONG', img: 'assets/batteries/tuflong.png' },
  ];
}

