import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineTemperatureHistory } from './machine-temperature-history';

describe('MachineTemperatureHistory', () => {
  let component: MachineTemperatureHistory;
  let fixture: ComponentFixture<MachineTemperatureHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineTemperatureHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(MachineTemperatureHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
