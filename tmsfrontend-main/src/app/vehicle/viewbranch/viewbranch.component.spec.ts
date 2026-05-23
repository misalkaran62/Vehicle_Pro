import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbranchComponent } from './viewbranch.component';

describe('ViewbranchComponent', () => {
  let component: ViewbranchComponent;
  let fixture: ComponentFixture<ViewbranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewbranchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewbranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
