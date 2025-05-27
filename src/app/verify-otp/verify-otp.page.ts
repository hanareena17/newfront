import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule,
    IonCardContent, IonButton, IonInput, IonItem, IonLabel
  ]
})
export class VerifyOtpPage implements OnInit {
  otp: string = '';
  userId: string = '';
  otpExpired = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get user_id from route params
    this.route.params.subscribe(params => {
      const userId = params['user_id'];
      console.log('Raw user_id from params:', userId);
      
      if (userId) {
        this.userId = userId;
        console.log('User ID (string):', this.userId);
        
        if (!this.userId) {
          console.error('Invalid user_id format:', userId);
          alert('Invalid user ID. Please try registering again.');
          this.router.navigate(['/register']);
        }
      } else {
        console.error('No user_id in params');
        alert('User ID is missing. Please try registering again.');
        this.router.navigate(['/register']);
      }
    });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    if (!this.userId) {
      alert('Invalid user ID. Please try registering again.');
      this.router.navigate(['/register']);
      return;
    }

    const otpPayload = {
      user_id: this.userId,
      otp: this.otp.trim(),
    };

    console.log('Sending OTP verification request with payload:', otpPayload);
    console.log('OTP type:', typeof this.otp);
    console.log('User ID type:', typeof this.userId);
    console.log('OTP length:', this.otp.length);
    console.log('OTP value:', this.otp);

    this.http.post('http://127.0.0.1:8000/api/verify-otp', otpPayload).subscribe({
      next: (response: any) => {
        console.log('OTP verification response:', response);
        if (response.success) {
          alert('OTP verified successfully!');
          this.router.navigate(['/home']);
        } else {
          alert(response.message || 'OTP verification failed. Please try again!');
        }
      },
  //     error: (error) => {
  //       console.error('OTP verification error:', error);
  //       console.error('Error response:', error.error);
  //       if (error.status === 422) {
  //         alert(error.error?.message || 'Invalid OTP or user ID. Please try again.');
  //       } else {
  //         alert(error.error?.message || 'An error occurred while verifying OTP. Please try again!');
  //       }
  //     }
  //   });
  // }
  error: (error) => {
    console.error('OTP verification error:', error);
    console.error('Error response:', error.error);
    if (error.status === 422) {
      alert(error.error?.message || 'Invalid OTP or user ID. Please try again.');
    } else if (error.status === 404) {
      alert('User not found. Please check your user ID or register again.');
    } else {
      alert(error.error?.message || 'An error occurred while verifying OTP. Please try again!');
    }
  }
});
}

  resendOtp() {
    if (!this.userId) {
      alert('Invalid user ID. Please try registering again.');
      this.router.navigate(['/register']);
      return;
    }
    
    const payload = { user_id: this.userId };
    this.http.post('http://127.0.0.1:8000/api/resend-otp', payload).subscribe({
      next: (res: any) => {
        alert('OTP telah dihantar semula.');
        this.otpExpired = false;
      },
      error: (err) => {
        console.error('Resend OTP error:', err);
        alert(err.error?.message || 'Gagal hantar semula OTP.');
      }
    });
  }
}

//   resendOtp() {
//     const payload = { user_id: this.userId };
//     this.http.post('http://127.0.0.1:8000/api/resend-otp', payload).subscribe({
//       next: (res: any) => {
//         alert('OTP telah dihantar semula.');
//         this.otpExpired = false;
//       },
//       error: (err) => {
//         console.error('Resend OTP error:', err);
//         alert(err.error?.message || 'Gagal hantar semula OTP.');
//       }
//     });
//   }
// }
