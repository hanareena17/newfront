import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

// Import Ionic components one-shot dari standalone
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,  
  IonIcon,
  IonRouterLink
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonRouterLink
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private navCtrl: NavController, private router: Router) {}

  ngOnInit() {}
  
  goToRegister() { this.router.navigate(['/register']); }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  login() {
    this.http.post<any>('http://127.0.0.1:8000/api/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        console.log('Login response:', res);
        const token = res.data.token;
        console.log('Saved token:', token);
        localStorage.setItem('token', token);
        alert('Login success!');
        this.navCtrl.navigateForward('/home');
      },
      error: err => {
        alert('Login failed!');
        console.error(err);
      }
    });
  }

  loginAsGuest() {
    alert('You are now browsing as a guest!');
    this.navCtrl.navigateForward('/home');
  }
}

