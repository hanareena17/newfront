import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountAboutPage } from './account-about.page';

describe('AccountAboutPage', () => {
  let component: AccountAboutPage;
  let fixture: ComponentFixture<AccountAboutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
