import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { CarBrand, CarModel, CarService, NewUserCar } from '../services/car.service';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList,
  IonItem, IonButton, IonLabel, IonInput, IonSelect, IonSelectOption, IonNote,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';

interface CarDetailsSummary {
  license_plate: string;
  car_brand_name: string;
  car_model_name: string;
}

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
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CarInfoPage implements OnInit {
  carForm: FormGroup;
  carBrands$: Observable<CarBrand[]> = of([]);
  carModels$: Observable<CarModel[]> = of([]);
  
  // New properties for displaying car details
  showCarDetails: boolean = false;
  carDetails: CarDetailsSummary | null = null;
  
  // Array to store multiple cars
  userCars: CarDetailsSummary[] = [];
  
  get isCarModelSelectDisabled(): boolean {
    return this.carForm.controls['car_model_id'].disabled;
  }

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.carForm = this.fb.group({
      license_plate: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      car_brand_id: [null, Validators.required],
      car_model_id: [{ value: null, disabled: true }, Validators.required] // Initial state
    });
  }

  ngOnInit() {
    this.loadCarBrands();
    this.onBrandChange();
  }

  async loadCarBrands() {
    const loading = await this.loadingCtrl.create({ message: 'Loading brands...' });
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
      this.carForm.controls['car_model_id'].reset(); // Use controls property
      this.carForm.controls['car_model_id'].disable(); // Use controls property
      if (brandId) {
        this.loadCarModels(brandId);
      } else {
        this.carModels$ = of([]);
      }
    });
  }

  async loadCarModels(brandId: string) {
    const loading = await this.loadingCtrl.create({ message: 'Loading models...' });
    await loading.present();
    this.carModels$ = this.carService.getCarModels(brandId).pipe(
      tap(models => {
        if (models && models.length > 0) {
          this.carForm.controls['car_model_id'].enable(); // Use controls property
        } else {
          this.carForm.controls['car_model_id'].disable(); // Use controls property
        }
      }),
      catchError(err => {
        this.presentToast('Failed to load car models. ' + (err.message || 'Unknown error'), 'danger');
        this.carForm.controls['car_model_id'].disable(); // Use controls property
        return of([]);
      }),
      finalize(() => loading.dismiss())
    );
  }

  async addCar() {
    if (this.carForm.invalid) {
      this.presentToast('Please fill all required fields correctly.', 'warning');
      this.carForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Adding car...' });
    await loading.present();

    const carData: NewUserCar = {
      license_plate: this.carForm.value.license_plate,
      car_brand_id: this.carForm.value.car_brand_id,
      car_model_id: this.carForm.value.car_model_id
    };

    this.carService.addUserCar(carData).pipe(
      tap(async (addedUserCar) => {
        await this.presentToast('Car added successfully!', 'success');

        try {
          // Get current values from observables
          const brands: CarBrand[] = await firstValueFrom(this.carBrands$);
          const models: CarModel[] = await firstValueFrom(this.carModels$);

          // Now use the resolved arrays 'brands' and 'models'
          const selectedBrand = brands.find(b => b.id === carData.car_brand_id);
          const selectedModel = models.find(m => m.id === carData.car_model_id);

          this.carDetails = {
            license_plate: addedUserCar.license_plate,
            car_brand_name: selectedBrand ? selectedBrand.name : 'N/A',
            car_model_name: selectedModel ? selectedModel.name : 'N/A',
          };

          // Add to user cars array
          this.userCars.push(this.carDetails);

          // Reset form for next entry
          this.carForm.reset();
          this.carForm.controls['car_model_id'].disable();
          this.carModels$ = of([]);

          // Show car details below form
          this.showCarDetails = true;

        } catch (e) {
          console.error("Error fetching brands/models for summary:", e);
          // Fallback if fetching brands/models for summary fails
          this.carDetails = {
            license_plate: addedUserCar.license_plate,
            car_brand_name: 'N/A', // Fallback name
            car_model_name: 'N/A', // Fallback name
          };
          
          // Add to user cars array
          this.userCars.push(this.carDetails);
          
          // Reset form for next entry
          this.carForm.reset();
          this.carForm.controls['car_model_id'].disable();
          this.carModels$ = of([]);
          
          this.showCarDetails = true;
        }

      }),
      catchError(async (err) => {
        let errorMessage = 'Failed to add car.';
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
      finalize(() => loading.dismiss())
    ).subscribe();
  }

  // Method to remove a car from the list
  removeCar(index: number) {
    this.userCars.splice(index, 1);
    if (this.userCars.length === 0) {
      this.showCarDetails = false;
    }
  }

  // Method to edit a car (placeholder - could navigate to edit page)
  editCar(index: number) {
    const carToEdit = this.userCars[index];
    console.log('Edit car:', carToEdit);
    // Implement edit functionality here
  }

  // New method when user is done
  done() {
    this.navCtrl.navigateRoot('/home'); // Navigate to home or another appropriate page
  }

  // New method to go to car summary page (optional)
  goToCarSummary() {
    if (this.carDetails) {
      this.router.navigate(['/car-summary'], { state: { carDetails: this.carDetails } });
    }
  }

  async presentToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'tertiary' | 'light' | 'medium' | 'dark' = 'medium') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }

  get license_plate() { return this.carForm.get('license_plate'); }
  get car_brand_id() { return this.carForm.get('car_brand_id'); }
  get car_model_id() { return this.carForm.get('car_model_id'); }
}