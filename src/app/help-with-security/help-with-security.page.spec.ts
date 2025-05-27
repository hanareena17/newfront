import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpWithSecurityPage } from './help-with-security.page';

describe('HelpWithSecurityPage', () => {
  let component: HelpWithSecurityPage;
  let fixture: ComponentFixture<HelpWithSecurityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpWithSecurityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
