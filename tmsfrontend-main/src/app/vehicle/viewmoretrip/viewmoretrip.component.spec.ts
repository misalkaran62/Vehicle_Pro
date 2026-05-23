import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmoretripComponent } from './viewmoretrip.component';

describe('ViewmoretripComponent', () => {
  let component: ViewmoretripComponent;
  let fixture: ComponentFixture<ViewmoretripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewmoretripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewmoretripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
