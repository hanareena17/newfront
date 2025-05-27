import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },

  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },

  
  {
    path: 'splash',
      loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage),
    },

    {
      path: '',
      redirectTo: 'splash',
      pathMatch: 'full',
    },
    
{
  path : 'profile',
  loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage)
},
  {
    path: 'history',
    loadComponent: () => import('./history/history.page').then( m => m.HistoryPage)
  },

  {
  path: 'history',
  loadComponent: () => import('./history/history.page').then( m => m.HistoryPage)
},
  {
    path: 'outlets',
    loadComponent: () => import('./outlets/outlets.page').then( m => m.OutletsPage)
  },

  {
    path: 'booking',
    loadComponent: () => import('./booking/booking.page').then( m => m.BookingPage)
  },

  {
    path: 'booking',
    loadComponent: () => import('./booking/booking.page').then(m => m.BookingPage)
  },
  {
    path: 'redeem',
    loadComponent: () => import('./redeem/redeem.page').then( m => m.RedeemPage)
  },
  {
    path: 'track-technician',
    loadComponent: () => import('./track-technician/track-technician.page').then( m => m.TrackTechnicianPage)
  },
  
  //   path: 'order-detail',
  //   loadComponent: () => import('./order-detail/order-detail.page').then( m => m.OrderDetailPage)
  // },
  {
    path: 'warranty-detail',
    loadComponent: () => import('./warranty-detail/warranty-detail.page').then( m => m.WarrantyDetailPage)
  },
  {
    path: 'personal-info',
    loadComponent: () => import('./personal-info/personal-info.page').then( m => m.PersonalInfoPage)
  },
  {
    path: 'car-info',
    loadComponent: () => import('./car-info/car-info.page').then( m => m.CarInfoPage)
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments.page').then( m => m.PaymentsPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.page').then( m => m.NotificationsPage)
  },
  {
    path: 'privacy',
   loadComponent: () => import('./privacy/privacy.page').then(m => m.PrivacyPage)

  },
  {
    path: 'to-help-center',
    loadComponent: () => import('./to-help-center/to-help-center.page').then( m => m.ToHelpCenterPage)
  },
  {
    path: 'help-with-security',
    loadComponent: () => import('./help-with-security/help-with-security.page').then( m => m.HelpWithSecurityPage)
  },
 
  {
    path: 'invoice-preview',
    loadComponent: () => import('./invoice-preview/invoice-preview.page').then( m => m.InvoicePreviewPage)
  },
  {
    path: 'chat-bot',
    loadComponent: () => import('./chat-bot/chat-bot.page').then( m => m.ChatBotPage)
  },
  {
    path: 'terms-of-use',
    loadComponent: () => import('./terms-of-use/terms-of-use.page').then( m => m.TermsOfUsePage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'battery-history',
    loadComponent: () => import('./battery-history/battery-history.page').then( m => m.BatteryHistoryPage)
  },
  {
    path: 'batteries',
    loadComponent: () => import('./batteries/batteries.page').then( m => m.BatteriesPage)
  },
  {
    path: 'batteryshop',
    loadComponent: () => import('./batteryshop/batteryshop.page').then( m => m.BatteryshopPage)
  },
  {
    path: 'product-details',
    loadComponent: () => import('./product-details/product-details.page').then( m => m.ProductDetailsPage)
  },

  {
    path: 'verify-otp/:user_id',
    loadComponent: () => import('./verify-otp/verify-otp.page').then(m => m.VerifyOtpPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },



];
