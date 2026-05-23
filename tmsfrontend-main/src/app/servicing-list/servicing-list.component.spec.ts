import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicingListComponent } from './servicing-list.component';

describe('ServicingListComponent', () => {
  let component: ServicingListComponent;
  let fixture: ComponentFixture<ServicingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
