import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router'; // ✅ Import Router



@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      console.log('Token from splash:', token);
      
      if (token) {
        this.router.navigateByUrl('/login');
      } else {
        this.router.navigateByUrl('/home');
      }
    }, 3000); // 2 seconds splash delay
  }
}
  
