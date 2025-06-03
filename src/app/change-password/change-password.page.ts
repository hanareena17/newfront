import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  IonInput,
  ToastController
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [
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
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;
  isLoading = false;
  backendUrl = 'http://127.0.0.1:8000';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {
    this.changePasswordForm = this.fb.group({
      current_password: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
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
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      try {
        const response = await this.http.post(`${this.backendUrl}/api/change-password`, this.changePasswordForm.value).toPromise();
        await this.showToast('Kata laluan berjaya ditukar', 'success');
        this.router.navigate(['/profile']);
      } catch (error: any) {
        const errorMessage = error.error?.message || 'Ralat menukar kata laluan';
        await this.showToast(errorMessage, 'danger');
      } finally {
        this.isLoading = false;
      }
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}