import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicingComponent } from './add-servicing.component';

describe('AddServicingComponent', () => {
  let component: AddServicingComponent;
  let fixture: ComponentFixture<AddServicingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServicingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
