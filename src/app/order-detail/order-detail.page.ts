// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {
//   IonContent,
//   IonHeader,
//   IonTitle,
//   IonToolbar,
//   IonButtons,
//   IonBackButton,
//   IonItem,
//   IonLabel,
//   IonList,
//   IonThumbnail,
//   IonButton,

  
// } from '@ionic/angular/standalone';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-order-detail',
//   templateUrl: './order-detail.page.html',
//   styleUrls: ['./order-detail.page.scss'],
//   standalone: true,
//   imports: [
//     IonContent,
//     IonHeader,
//     IonTitle,
//     IonToolbar,
//     IonButtons,
//     IonBackButton,
//     IonItem,
//     IonLabel,
//     IonList,
//     IonThumbnail,
//     IonButton,
//     CommonModule,
//     FormsModule
//   ]
// })
// export class OrderDetailPage implements OnInit {
//   order: any;

//   downloadInvoice() {
//     console.log('Invoice download initiated (dummy)');
//     // nanti sambung ke real PDF/download logic
//   }

//   goToInvoicePreview() {
//     this.router.navigate(['/invoice-preview']);
//   }

//   constructor(private router: Router) {
//     const nav = this.router.getCurrentNavigation();
//     this.order = nav?.extras?.state?.['order'];
//   }

//   ngOnInit(): void {}

//   goToWarranty(item: any) {
//     this.router.navigate(['/warranty-detail'], {
//       state: { warranty: item.warrantyDetails }
//     });
//   }
// }
