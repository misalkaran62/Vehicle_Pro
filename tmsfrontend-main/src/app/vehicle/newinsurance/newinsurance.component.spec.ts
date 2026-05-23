import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewinsuranceComponent } from './newinsurance.component';

describe('NewinsuranceComponent', () => {
  let component: NewinsuranceComponent;
  let fixture: ComponentFixture<NewinsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewinsuranceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewinsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
