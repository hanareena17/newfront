import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.page.html',
  styleUrls: ['./outlets.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCardContent, IonCard]
})
export class OutletsPage implements OnInit {
  outlets: any[] =[];

  constructor(private router:Router) {
    const savedOutlets = localStorage.getItem('outlets');
    this.outlets = savedOutlets ? JSON.parse(savedOutlets) : [];
   }

  ngOnInit() {
    
  }

}
