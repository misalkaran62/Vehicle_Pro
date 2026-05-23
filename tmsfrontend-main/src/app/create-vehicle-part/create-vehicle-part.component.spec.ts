import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVehiclePartComponent } from './create-vehicle-part.component';

describe('CreateVehiclePartComponent', () => {
  let component: CreateVehiclePartComponent;
  let fixture: ComponentFixture<CreateVehiclePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVehiclePartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVehiclePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
