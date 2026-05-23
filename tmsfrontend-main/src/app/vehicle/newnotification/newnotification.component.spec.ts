import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewnotificationComponent } from './newnotification.component';

describe('NewnotificationComponent', () => {
  let component: NewnotificationComponent;
  let fixture: ComponentFixture<NewnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewnotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
