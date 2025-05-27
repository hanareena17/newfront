import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonLabel, 
  IonItem, 
  IonButton,
  IonBackButton,
  IonButtons,
  IonSpinner,
  IonNote,
  ToastController,
  LoadingController,
  IonInput
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    ReactiveFormsModule, 
    IonTitle, 
    IonToolbar, 
    IonLabel, 
    IonItem,  
    IonButton, 
    CommonModule, 
    FormsModule,
    IonBackButton,
    IonButtons,
    IonSpinner,
    IonNote,
    IonInput
  ]
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isLoading: boolean = false;
  backendUrl: string = 'http://127.0.0.1:8000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { 
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.showToast('Invalid or missing reset token. Please use the link from your email.', 'danger');
        this.router.navigate(['/login']);
        return;
      }

      console.log('Token received:', this.token);
      // if token exits, verify it and pre-fill the email
      //fix: use the correct backend URL and endpoint

      // If token exists, verify it and pre-fill the email

      this.http.get(`${this.backendUrl}/api/verify-reset-token/${this.token}`) 
           .subscribe({
          next: (res: any) => {
            console.log('Token verified successfully:', res);
            if (res.email) {
              this.resetForm.patchValue({ email: res.email });
            }
          },
          error: (err) => {
            console.error('Token verification error:', err);
            const errorMessage = err.error?.message || 'Invalid or expired reset link';
            this.showToast(errorMessage, 'danger');
            this.router.navigate(['/login']);
          }
        });
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('password_confirmation')?.value;
    
    if (password !== confirmPassword) {
      form.get('password_confirmation')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSubmit() {
    if (!this.token) {
      await this.showToast('Invalid or missing reset token. Please use the link from your email.', 'danger');
      return;
    }
    if (this.resetForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Resetting password...'
      });
      await loading.present();

      const formData = {
        email: this.resetForm.get('email')?.value,
        password: this.resetForm.get('password')?.value,
        password_confirmation: this.resetForm.get('password_confirmation')?.value,
        token: this.token
      };

      console.log('Submitting reset password form:', formData);

      this.http.post(`${this.backendUrl}/api/reset-password`, formData)
        .subscribe({
          next: async (res: any) => {
            console.log('Password reset successful:', res);
            await loading.dismiss();
            this.isLoading = false;
            await this.showToast('Password successfully reset', 'success');
            this.router.navigate(['/login']);
          },
          error: async (err) => {
            console.error('Password reset error:', err);
            await loading.dismiss();
            this.isLoading = false;
            const errorMessage = err.error?.message || 'Error resetting password';
            await this.showToast(errorMessage, 'danger');
          }
        });
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}
