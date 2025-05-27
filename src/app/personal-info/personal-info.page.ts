import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Added HttpHeaders
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonButton, IonInput, IonItem, IonSelect, IonDatetime, IonBackButton, IonButtons, IonIcon, AlertController } from '@ionic/angular/standalone'; // Added AlertController
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Added AuthService

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonItem,
    IonSelect,
    IonDatetime,
    IonBackButton,
    IonButtons,
    IonSelectOption,
    IonIcon
  ]
})
export class PersonalInfoPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  user: any = {
    name: '',
    email: '',
    phone: '',
    ic: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    gender: '',
    dob: '',
    profile_image: ''
  };

  selectedFile: File | null = null;

  // Set min and max dates for DOB
  minDate = '1900-01-01';
  maxDate = new Date().toISOString();

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController, // Injected AlertController
    private authService: AuthService // Injected AuthService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profile_image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    // Use apiUrl from AuthService for consistency
    const apiUrl = this.authService.apiUrl; // Assuming AuthService has a public apiUrl or a getter
    this.http.get(`${apiUrl}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Profile data:', response);
        if (response.data) {
          // Format the date if it exists
          if (response.data.profile?.dob) {
            response.data.profile.dob = new Date(response.data.profile.dob).toISOString();
          }
          // Merge user and profile data
          this.user = {
            ...response.data.profile,
            ...response.data.user
            
          };
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        alert('Failed to load profile data');
      }
    });
  }

  saveChanges() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();
    
    // Add profile data
    formData.append('address', this.user.address || '');
    formData.append('city', this.user.city || '');
    formData.append('state', this.user.state || '');
    formData.append('postcode', this.user.postcode || '');
    formData.append('gender', this.user.gender || '');
    formData.append('dob', this.user.dob ? new Date(this.user.dob).toISOString().split('T')[0] : '');
    formData.append('ic', this.user.ic || '');
    formData.append('phone', this.user.phone || '');

    // Add profile image if selected
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }
    const apiUrl = this.authService.apiUrl;
    this.http.post(`${apiUrl}/user/profile`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Profile updated:', response);
        // Update localStorage with new profile data
        if (response.data?.profile) {
          localStorage.setItem('profile_image', response.data.profile.profile_image || '');
          localStorage.setItem('user_data', JSON.stringify(response.data));
        }
        alert('Profile updated successfully');
        // Navigate back to profile page
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        if (error.error && error.error.message) {
          alert('Failed to update profile: ' + error.error.message);
        } else {
          alert('Failed to update profile');
        }
      }
    });
  }

  getProfileImage(): string | null {
    // Check if profile_image is a data URL (from file preview) or a server URL
    if (this.user?.profile_image && this.user.profile_image.startsWith('data:image')) {
      return this.user.profile_image;
    }
    // If it's a server URL, ensure it's not the placeholder or empty
    if (this.user?.profile_image && this.user.profile_image.trim() !== '' && !this.user.profile_image.includes('pravatar')) {
        // Assuming API returns full URL or you prepend base URL if needed
        return this.user.profile_image;
    }
    return null;
  }

  async confirmDeleteProfileImage() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete your profile picture?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteProfileImage();
          },
        },
      ],
    });
    await alert.present();
  }

  deleteProfileImage() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    const apiUrl = this.authService.apiUrl;
    this.http.delete(`${apiUrl}/user/profile/image`, {
      headers: new HttpHeaders({ // Ensure HttpHeaders is imported
        'Authorization': `Bearer ${token}`
      })
    }).subscribe({
      next: (response: any) => {
        console.log('Profile image deleted:', response);
        this.user.profile_image = null; // Clear local preview
        this.selectedFile = null; // Clear selected file if any
        // Optionally, update localStorage or any shared state
        localStorage.removeItem('profile_image'); // Example if you stored it directly
        alert(response.message || 'Profile image deleted successfully.');
        this.loadUserProfile(); // Reload to get fresh data (or just update locally)
      },
      error: (error) => {
        console.error('Error deleting profile image:', error);
        alert(error.error?.message || 'Failed to delete profile image.');
      }
    });
  }
}
