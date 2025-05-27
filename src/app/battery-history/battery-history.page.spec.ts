import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatteryHistoryPage } from './battery-history.page';

describe('BatteryHistoryPage', () => {
  let component: BatteryHistoryPage;
  let fixture: ComponentFixture<BatteryHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
