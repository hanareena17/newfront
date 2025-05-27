import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonButton,
    IonIcon
  ]
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  phone='';

  constructor(private http: HttpClient, private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
   register() {
    if (!this.name || !this.email || !this.password || !this.phone) {
      alert('Sila lengkapkan semua maklumat.');
      return;
    }
  
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.passwordConfirmation,
      phone: this.phone
    };
    
    this.http.post('http://127.0.0.1:8000/api/register', data).subscribe({
     next: (res: any) => {
     console.log('Registration response:', res);
     if (res.data && res.data.user_id) {
       const userId = res.data.user_id;
       console.log('User ID from response:', userId);
       localStorage.setItem('token', res.data.token);
       localStorage.setItem('user_id', userId.toString());
       
       // Navigate to verify-otp with user_id
       this.router.navigate(['/verify-otp', userId]).then(() => {
         console.log('Navigation completed');
       }).catch(err => {
         console.error('Navigation error:', err);
       });
     } else {
       console.error('Missing user_id in response:', res);
       alert('Registration successful but user ID is missing. Please try again.');
     }
      },
    error: err => {
        console.error('Registration error:', err);
        alert('Gagal daftar. Sila semak input: ' + (err.error?.message || 'Unknown error'));
     }
   });
  }
}
