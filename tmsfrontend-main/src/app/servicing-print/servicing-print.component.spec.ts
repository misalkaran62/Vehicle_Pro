import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicingPrintComponent } from './servicing-print.component';

describe('ServicingPrintComponent', () => {
  let component: ServicingPrintComponent;
  let fixture: ComponentFixture<ServicingPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicingPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicingPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
