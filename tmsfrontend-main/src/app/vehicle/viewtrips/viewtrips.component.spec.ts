import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtripsComponent } from './viewtrips.component';

describe('ViewtripsComponent', () => {
  let component: ViewtripsComponent;
  let fixture: ComponentFixture<ViewtripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewtripsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewtripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
