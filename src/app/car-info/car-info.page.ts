import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { CarBrand, CarModel, CarService, NewUserCar } from '../services/car.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList,
  IonItem, IonButton, IonLabel, IonInput, IonSelect, IonSelectOption, IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.page.html',
  styleUrls: ['./car-info.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList,
    IonItem, IonButton, IonLabel, IonInput, IonSelect, IonSelectOption, IonNote,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CarInfoPage implements OnInit {
  carForm: FormGroup;
  carBrands$: Observable<CarBrand[]> = of([]);
  carModels$: Observable<CarModel[]> = of([]);
  
  get isCarModelSelectDisabled(): boolean {
    return this.carForm.controls['car_model_id'].disabled;
  }

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
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
      tap(async (newCar) => {
        await this.presentToast('Car added successfully!', 'success');
        this.carForm.reset();
        this.carForm.controls['car_model_id'].disable(); // Use controls property
      }),
      catchError(async (err) => {
        let errorMessage = 'Failed to add car.';
        // Check if err and err.error exist and err.error is an object
        if (err && err.error && typeof err.error === 'object') {
            // Assert the type of err.error.errors if it exists
            const apiErrors = (err.error as any).errors as Record<string, string[]>;
            if (apiErrors && typeof apiErrors === 'object') {
                // Use reduce and concat for flattening, with explicit types
                errorMessage = Object.values(apiErrors)
                                   .reduce((acc: string[], val: string[]) => acc.concat(val), [])
                                   .join(' ');
            } else if ((err.error as any).message) { // Check for a message property on err.error
                errorMessage = (err.error as any).message;
            }
        } else if (err && err.message) { // Fallback to err.message
            errorMessage = err.message;
        }
        await this.presentToast(errorMessage, 'danger');
        return of(null);
      }),
      finalize(() => loading.dismiss())
    ).subscribe();
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
