import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackTechnicianPage } from './track-technician.page';

describe('TrackTechnicianPage', () => {
  let component: TrackTechnicianPage;
  let fixture: ComponentFixture<TrackTechnicianPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackTechnicianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
