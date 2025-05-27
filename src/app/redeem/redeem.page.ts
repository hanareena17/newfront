import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-redeem',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './redeem.page.html',
  styleUrls: ['./redeem.page.scss'],
})
export class RedeemPage implements OnInit  {
  userPoints = 0;
  showPreview = false;
  previewImage = '';
  
  rewards: any[] = []; // Will be populated from API
  loadingRewards = true;

  constructor(
    private navCtrl: NavController,
    private http: HttpClient, // Still needed for redeemItem, unless that's also moved to a service
    private toastCtrl: ToastController,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit() {
    this.loadUserPoints();
    this.loadRewards();
  }

  loadUserPoints() {
    if (!this.authService.isAuthenticated()) {
      this.showToast('Please log in to see your points.');
      this.userPoints = 0;
      // Optionally navigate to login
      // this.navCtrl.navigateRoot('/login');
      return;
    }

    this.authService.getUserPoints().subscribe({
      next: (response) => {
        this.userPoints = response.points;
      },
      error: (error) => {
        console.error('Failed to get points', error);
        this.showToast('Unable to fetch user points.');
        this.userPoints = 0; // Default to 0 on error
      }
    });
  }

  loadRewards() {
    this.loadingRewards = true;
    this.authService.getRewards().subscribe({
      next: (data) => {
        this.rewards = data.map(reward => ({
          ...reward,
          // Keep points for display, but it's points_cost from backend
          points: reward.points_cost,
          img: reward.image_url || 'assets/icon/favicon.png' // Fallback image
        }));
        this.loadingRewards = false;
      },
      error: (err) => {
        console.error('Failed to load rewards', err);
        this.showToast('Could not load rewards. Please try again later.');
        this.loadingRewards = false;
      }
    });
  }

  openPreview(image: string) {
    this.previewImage = image;
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async redeemItem(item: any) {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (this.userPoints < item.points) {
      this.showToast('Insufficient points to redeem this item.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    try {
      // Use the correct API URL from AuthService and the new endpoint
      const apiUrl = this.authService['apiUrl']; // Accessing private member, consider making it public or providing a getter
      const response: any = await this.http.post(`${apiUrl}/user/points/redeem`, {
        reward_item_id: item.id // Send the reward_item_id (which is the UUID from backend)
      }, { headers }).toPromise();

      // Update points from the server's response for consistency
      if (response && typeof response.new_points_balance !== 'undefined') {
        this.userPoints = response.new_points_balance;
      } else {
        // Fallback if new_points_balance is not in response (should not happen with current backend)
        this.userPoints -= item.points;
      }
      this.showToast(response.message || `You have successfully redeemed: ${item.name}`);
    } catch (error: any) {
      console.error('Redeem failed', error);
      const errorMessage = error?.error?.message || 'Redemption failed. Please try again.';
      this.showToast(errorMessage);
    }
  }
}
