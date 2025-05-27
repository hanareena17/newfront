import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { CarBrand, CarModel, CarService, NewUserCar, UserCar } from '../services/car.service';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList,
  IonItem, IonButton, IonLabel, IonInput, IonSelect, IonSelectOption, IonNote,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
  IonIcon
} from '@ionic/angular/standalone';

// Interface CarDetailsSummary is no longer needed as we'll use UserCar directly
// interface CarDetailsSummary {
//   id: string;
//   license_plate: string;
//   car_brand_name: string;
//   car_model_name: string;
//   date_added?: Date;
// }

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.page.html',
  styleUrls: ['./car-info.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList,
    IonItem, IonButton, IonLabel, IonInput, IonSelect, IonSelectOption, IonNote,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
    IonIcon,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CarInfoPage implements OnInit {
  carForm: FormGroup;
  carBrands$: Observable<CarBrand[]> = of([]);
  carModels$: Observable<CarModel[]> = of([]);
  
  // Properties for displaying car details
  showCarDetails: boolean = false;
  // carDetails: CarDetailsSummary | null = null; // We can derive this or manage differently if needed
  
  // Array to store multiple cars
  userCars: UserCar[] = []; // Changed to UserCar[]
  
  // Loading states
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  editingCarId: string | null = null;
  
  get isCarModelSelectDisabled(): boolean {
    return this.carForm.controls['car_model_id'].disabled;
  }

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.carForm = this.fb.group({
      license_plate: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      car_brand_id: [null, Validators.required],
      car_model_id: [{ value: null, disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.loadCarBrands();
    this.onBrandChange();
    this.loadUserCars(); // Load existing cars from the service
  }

  async loadUserCars() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading your cars...',
      spinner: 'crescent'
    });
    await loading.present();

    this.carService.getUserCars().pipe(
      tap(cars => {
        this.userCars = cars.map(car => ({
          ...car,
          license_plate: car.license_plate.toUpperCase()
        }));
        this.showCarDetails = this.userCars.length > 0;
        this.saveToLocalStorage();
      }),
      catchError(async (err) => {
        await this.presentToast('Failed to load your cars. ' + (err.message || 'Unknown error'), 'danger');
        // Load from local storage as a fallback
        this.loadFromLocalStorage();
        return of([]);
      }),
      finalize(() => loading.dismiss())
    ).subscribe();
  }

  loadFromLocalStorage() {
    try {
      const storedCars = localStorage.getItem('userCars');
      if (storedCars) {
        this.userCars = JSON.parse(storedCars);
        this.showCarDetails = this.userCars.length > 0;
      }
    } catch (error) {
      console.log('Could not load cars from localStorage', error);
    }
  }

  async loadCarBrands() {
    const loading = await this.loadingCtrl.create({ 
      message: 'Loading brands...',
      spinner: 'crescent'
    });
    await loading.present();
    
    this.carBrands$ = this.carService.getCarBrands().pipe(
      catchError(err => {
        this.presentToast('Failed to load car brands. ' + (err.message || 'Unknown error'), 'danger');
        return of([]);
      }),
      finalize(() => loading.dismiss())
    );
  }

  onBrandChange(): void {
    this.carForm.get('car_brand_id')?.valueChanges.subscribe(brandId => {
      this.carForm.controls['car_model_id'].reset();
      this.carForm.controls['car_model_id'].disable();
      if (brandId) {
        this.loadCarModels(brandId);
      } else {
        this.carModels$ = of([]);
      }
    });
  }

  async loadCarModels(brandId: string) {
    const loading = await this.loadingCtrl.create({ 
      message: 'Loading models...',
      spinner: 'crescent'
    });
    await loading.present();
    
    this.carModels$ = this.carService.getCarModels(brandId).pipe(
      tap(models => {
        if (models && models.length > 0) {
          this.carForm.controls['car_model_id'].enable();
        } else {
          this.carForm.controls['car_model_id'].disable();
        }
      }),
      catchError(err => {
        this.presentToast('Failed to load car models. ' + (err.message || 'Unknown error'), 'danger');
        this.carForm.controls['car_model_id'].disable();
        return of([]);
      }),
      finalize(() => loading.dismiss())
    );
  }

  async submitCarForm() {
    if (this.carForm.invalid) {
      this.presentToast('Please fill all required fields correctly.', 'warning');
      this.carForm.markAllAsTouched();
      return;
    }

    const licensePlateValue = this.carForm.value.license_plate.toUpperCase();

    // Check for duplicate license plate only if not in edit mode or if license plate changed
    if (!this.isEditMode || (this.editingCarId && this.userCars.find(c => c.id === this.editingCarId)?.license_plate !== licensePlateValue)) {
      const isDuplicate = this.userCars.some(car =>
        car.license_plate.toUpperCase() === licensePlateValue && car.id !== this.editingCarId
      );
      if (isDuplicate) {
        this.presentToast('A car with this license plate already exists!', 'warning');
        return;
      }
    }
    
    this.isSubmitting = true;
    const loadingMessage = this.isEditMode ? 'Updating car...' : 'Adding car...';
    const loading = await this.loadingCtrl.create({
      message: loadingMessage,
      spinner: 'crescent'
    });
    await loading.present();

    const carData: NewUserCar = {
      license_plate: this.carForm.value.license_plate,
      car_brand_id: this.carForm.value.car_brand_id,
      car_model_id: this.carForm.value.car_model_id
    };

    let carOperation$: Observable<UserCar | null>;

    if (this.isEditMode && this.editingCarId) {
      carOperation$ = this.carService.updateUserCar(this.editingCarId, carData).pipe(
        tap(async (updatedCar) => {
          await this.presentToast('Car updated successfully!', 'success');
          const index = this.userCars.findIndex(car => car.id === this.editingCarId);
          if (index !== -1 && updatedCar) {
            // Fetch full brand/model details for display consistency if not returned by update
             const brands: CarBrand[] = await firstValueFrom(this.carBrands$);
             const models: CarModel[] = await firstValueFrom(this.carModels$);
             const selectedBrand = brands.find(b => b.id === updatedCar.car_brand_id);
             const selectedModel = models.find(m => m.id === updatedCar.car_model_id);

            this.userCars[index] = {
                ...updatedCar,
                license_plate: updatedCar.license_plate.toUpperCase(),
                car_brand: selectedBrand, // Assuming backend returns full car_brand object or we fetch it
                car_model: selectedModel  // Assuming backend returns full car_model object or we fetch it
            };
          }
          this.resetFormAndState();
          this.saveToLocalStorage();
        })
      );
    } else {
      carOperation$ = this.carService.addUserCar(carData).pipe(
        tap(async (addedUserCar) => {
          await this.presentToast('Car added successfully!', 'success');
          if (addedUserCar) {
            const brands: CarBrand[] = await firstValueFrom(this.carBrands$);
            const models: CarModel[] = await firstValueFrom(this.carModels$);
            const selectedBrand = brands.find(b => b.id === addedUserCar.car_brand_id);
            const selectedModel = models.find(m => m.id === addedUserCar.car_model_id);

            const newCarEntry: UserCar = {
              ...addedUserCar,
              license_plate: addedUserCar.license_plate.toUpperCase(),
              car_brand: selectedBrand,
              car_model: selectedModel
            };
            this.userCars.unshift(newCarEntry);
            this.showCarDetails = true;
          }
          this.resetFormAndState();
          this.saveToLocalStorage();
        })
      );
    }

    carOperation$.pipe(
      catchError(async (err) => {
        let errorMessage = `Failed to ${this.isEditMode ? 'update' : 'add'} car.`;
        // ... (error handling as before)
        if (err && err.error && typeof err.error === 'object') {
          const apiErrors = (err.error as any).errors as Record<string, string[]>;
          if (apiErrors && typeof apiErrors === 'object') {
            errorMessage = Object.values(apiErrors)
              .reduce((acc: string[], val: string[]) => acc.concat(val), [])
              .join(' ');
          } else if ((err.error as any).message) {
            errorMessage = (err.error as any).message;
          }
        } else if (err && err.message) {
          errorMessage = err.message;
        }
        await this.presentToast(errorMessage, 'danger');
        return of(null);
      }),
      finalize(() => {
        loading.dismiss();
        this.isSubmitting = false;
      })
    ).subscribe();
  }

  private resetFormAndState() {
    this.carForm.reset();
    this.carForm.controls['car_model_id'].disable();
    this.carModels$ = of([]);
    this.isEditMode = false;
    this.editingCarId = null;
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('userCars', JSON.stringify(this.userCars));
    } catch (error) {
      console.log('Could not save to localStorage');
    }
  }

  // Method to remove a car from the list with confirmation
  async removeCar(index: number) {
    const car = this.userCars[index];
    const alert = await this.alertCtrl.create({
      header: 'Remove Car',
      message: `Are you sure you want to remove ${car.license_plate}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            const carToRemove = this.userCars[index];
            if (!carToRemove || !carToRemove.id) {
              this.presentToast('Error: Car ID not found for removal.', 'danger');
              return;
            }

            const loading = await this.loadingCtrl.create({ message: 'Removing car...', spinner: 'crescent' });
            await loading.present();

            this.carService.deleteUserCar(carToRemove.id).pipe(
              tap(() => {
                this.userCars.splice(index, 1);
                if (this.userCars.length === 0) {
                  this.showCarDetails = false;
                  // this.carDetails = null; // No longer using this.carDetails directly
                }
                // No need to manage this.carDetails here as it's not used for single car display
                this.saveToLocalStorage();
                this.presentToast('Car removed successfully', 'success');
              }),
              catchError(async (err) => {
                await this.presentToast('Failed to remove car. ' + (err.message || 'Unknown error'), 'danger');
                return of(null); // Important to return an observable
              }),
              finalize(() => loading.dismiss())
            ).subscribe();
          }
        }
      ]
    });

    await alert.present();
  }

  // Method to edit a car (placeholder - could navigate to edit page)
  async editCar(carToEdit: UserCar) { // Changed parameter to UserCar
    this.isEditMode = true;
    this.editingCarId = carToEdit.id;

    this.carForm.patchValue({
      license_plate: carToEdit.license_plate,
      car_brand_id: carToEdit.car_brand_id,
      // car_model_id will be set after models are loaded for the brand
    });
    
    this.carForm.controls['car_model_id'].enable(); // Enable before loading
    if (carToEdit.car_brand_id) {
      const loading = await this.loadingCtrl.create({ message: 'Loading models...', spinner: 'crescent' });
      await loading.present();
      this.carService.getCarModels(carToEdit.car_brand_id).pipe(
        tap(models => {
          this.carModels$ = of(models);
          if (models && models.length > 0) {
            this.carForm.controls['car_model_id'].enable();
            this.carForm.patchValue({ car_model_id: carToEdit.car_model_id });
          } else {
            this.carForm.controls['car_model_id'].disable();
          }
        }),
        catchError(async (err) => {
          this.presentToast('Failed to load car models for editing.', 'danger');
          this.carForm.controls['car_model_id'].disable();
          return of([]);
        }),
        finalize(() => loading.dismiss())
      ).subscribe();
    } else {
      this.carModels$ = of([]);
      this.carForm.controls['car_model_id'].disable();
    }
    // Scroll to form or highlight it
    const formElement = document.querySelector('form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  }

  cancelEdit() {
    this.resetFormAndState();
    this.presentToast('Edit cancelled', 'medium');
  }

  // Navigate back to home when user is done
  async done() {
    if (this.userCars.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'No Cars Added',
        message: 'You haven\'t added any cars yet. Are you sure you want to leave?',
        buttons: [
          {
            text: 'Stay',
            role: 'cancel'
          },
          {
            text: 'Leave',
            handler: () => {
              this.navCtrl.navigateRoot('/home');
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.navCtrl.navigateRoot('/home');
    }
  }

  // Navigate to car summary page
  goToCarSummary() {
    if (this.userCars.length > 0) {
      this.router.navigate(['/car-summary'], { 
        state: {
          userCars: this.userCars.map(car => ({ // Map to a simpler structure if needed for summary
            id: car.id,
            license_plate: car.license_plate,
            car_brand_name: car.car_brand?.name || 'N/A',
            car_model_name: car.car_model?.name || 'N/A',
            date_added: car.created_at ? new Date(car.created_at) : undefined
          })),
          totalCars: this.userCars.length
        }
      });
    } else {
      this.presentToast('No cars to display in summary', 'warning');
    }
  }

  async presentToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'tertiary' | 'light' | 'medium' | 'dark' = 'medium') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  // Getters for form controls
  get license_plate() { return this.carForm.get('license_plate'); }
  get car_brand_id() { return this.carForm.get('car_brand_id'); }
  get car_model_id() { return this.carForm.get('car_model_id'); }
}