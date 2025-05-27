import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoicePreviewPage } from './invoice-preview.page';

describe('InvoicePreviewPage', () => {
  let component: InvoicePreviewPage;
  let fixture: ComponentFixture<InvoicePreviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
