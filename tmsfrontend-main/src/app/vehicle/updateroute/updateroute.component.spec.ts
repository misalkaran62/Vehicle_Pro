import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdaterouteComponent } from './updateroute.component';

describe('UpdaterouteComponent', () => {
  let component: UpdaterouteComponent;
  let fixture: ComponentFixture<UpdaterouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdaterouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdaterouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
