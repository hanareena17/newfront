import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController, IonContent, IonHeader, IonSpinner, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonInput, IonNote } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,IonSpinner, IonLabel, IonItem, IonButton, IonInput, IonNote,
    ReactiveFormsModule, CommonModule, FormsModule
  ]
})
export class ForgotPasswordPage {
  forgotForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.http.post('http://127.0.0.1:8000/api/forgot-password', this.forgotForm.value)
        .subscribe({
          next: async (res: any) => {
            this.isLoading = false;
            await this.showToast('Sila semak email anda untuk link reset password.', 'success');
            this.router.navigate(['/login']);
          },
          error: async (err) => {
            this.isLoading = false;
            const msg = err.error?.message || 'Ralat menghantar email reset password.';
            await this.showToast(msg, 'danger');
          }
        });
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