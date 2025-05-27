import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToHelpCenterPage } from './to-help-center.page';

describe('ToHelpCenterPage', () => {
  let component: ToHelpCenterPage;
  let fixture: ComponentFixture<ToHelpCenterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ToHelpCenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
