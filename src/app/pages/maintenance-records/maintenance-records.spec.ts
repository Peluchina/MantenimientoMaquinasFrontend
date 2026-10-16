import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRecords } from './maintenance-records';

describe('MaintenanceRecords', () => {
  let component: MaintenanceRecords;
  let fixture: ComponentFixture<MaintenanceRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRecords],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceRecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
