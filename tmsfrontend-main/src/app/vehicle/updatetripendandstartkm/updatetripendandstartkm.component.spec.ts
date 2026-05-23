import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatetripendandstartkmComponent } from './updatetripendandstartkm.component';

describe('UpdatetripendandstartkmComponent', () => {
  let component: UpdatetripendandstartkmComponent;
  let fixture: ComponentFixture<UpdatetripendandstartkmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatetripendandstartkmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatetripendandstartkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
