import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleregisterComponent } from './vehicleregister.component';

describe('VehicleregisterComponent', () => {
  let component: VehicleregisterComponent;
  let fixture: ComponentFixture<VehicleregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
