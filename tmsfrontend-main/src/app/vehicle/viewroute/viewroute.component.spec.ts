import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewrouteComponent } from './viewroute.component';

describe('ViewrouteComponent', () => {
  let component: ViewrouteComponent;
  let fixture: ComponentFixture<ViewrouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewrouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewrouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
