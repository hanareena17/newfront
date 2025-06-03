import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCardContent,
  IonAvatar,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
  IonFab,
  IonFabButton,
  IonBackButton,
  IonButtons, 
  IonInput,
  IonDatetime,
  AlertController
} from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserProfileService } from '../services/user-profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonCardContent,
    IonAvatar,
    IonItem,
    IonIcon,
    IonLabel,
    IonList,
    IonListHeader,
    IonFab,
    IonFabButton,
    IonBackButton,
    IonButtons,
    IonDatetime,
    IonInput,
  ]
})
export class ProfilePage implements OnInit {
  user: any = { // Initialize with a default structure
    name: 'Guest',
    email: '',
    profile_image: null,
    points: 0
  };
  loading = true;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router,
    private alertController: AlertController
  ) {}

  goToPersonalInfo() {
    this.router.navigate(['/personal-info']);
  }

  goToCarInfo() {
    this.router.navigate(['/car-info']);
  }

  goToPayments() {
    this.router.navigate(['/payments']);
  }
  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }

  goToHelpCenter() {
    this.router.navigate(['/to-help-center']);
  }

  goToHelpWithSecurity() {
    this.router.navigate(['/help-with-security']);
  }

  goToTermsOfUse() {
    this.router.navigate(['/terms-of-use']);
  }
  
    goToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

      goToAccountAbout() {
    this.router.navigate(['/account-about']);
  }

        goToAppUpdates() {
    this.router.navigate(['/app-updates']);
  }

          goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  ionViewWillEnter() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      this.loading = true;
      const profileResponse = await this.userProfileService.getProfile().toPromise();
      if (profileResponse?.data) {
        this.user = {
          ...this.user, // Preserve points if already fetched or default
          ...profileResponse.data.user,
          ...profileResponse.data.profile
        };
      } else {
        // Handle case where profile data might be missing but user is logged in
        this.user.name = this.user.name || 'User'; // Fallback name
      }


      // Fetch points
      if (this.authService.isAuthenticated()) {
        this.authService.getUserPoints().subscribe({
          next: (pointsResponse) => {
            this.user.points = pointsResponse.points;
            console.log('User points loaded for profile page:', this.user.points);
          },
          error: (pointsError) => {
            console.error('Error loading user points for profile page:', pointsError);
            this.user.points = 0; // Default to 0 on error
          }
        });
      } else {
        this.user.points = 0; // Not authenticated, no points
      }

    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  getProfileImage(): string | null {
    const img = this.user?.profile_image;
    // Check if it's a full URL (from server) or a data URL (local preview, less likely here)
    // and not the placeholder.
    if (img && img.trim() !== '' && !img.includes('pravatar.cc')) {
      return img;
    }
    return null; // Return null if no specific image is set
  }

  // handleImageError is no longer needed

  async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAccount() {
    try {
      // Show loading alert
      const loadingAlert = await this.alertController.create({
        message: 'Deleting your account...',
        backdropDismiss: false
      });
      await loadingAlert.present();

      // Call the delete account API
      await this.userProfileService.deleteAccount().toPromise();

      // Dismiss loading alert
      await loadingAlert.dismiss();

      // Show success message
      const successAlert = await this.alertController.create({
        header: 'Account Deleted',
        message: 'Your account has been successfully deleted.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await successAlert.present();

    } catch (error) {
      console.error('Error deleting account:', error);
      
      // Show error message
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Failed to delete account. Please try again later.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}

