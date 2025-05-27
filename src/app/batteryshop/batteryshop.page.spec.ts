import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatteryshopPage } from './batteryshop.page';

describe('BatteryshopPage', () => {
  let component: BatteryshopPage;
  let fixture: ComponentFixture<BatteryshopPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryshopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
