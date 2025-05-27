import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatteriesPage } from './batteries.page';

describe('BatteriesPage', () => {
  let component: BatteriesPage;
  let fixture: ComponentFixture<BatteriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
