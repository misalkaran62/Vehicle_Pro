import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmorevehicleComponent } from './viewmorevehicle.component';

describe('ViewmorevehicleComponent', () => {
  let component: ViewmorevehicleComponent;
  let fixture: ComponentFixture<ViewmorevehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewmorevehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewmorevehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
