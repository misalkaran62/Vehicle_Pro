import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServicngComponent } from './create-servicng.component';

describe('CreateServicngComponent', () => {
  let component: CreateServicngComponent;
  let fixture: ComponentFixture<CreateServicngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateServicngComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateServicngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
