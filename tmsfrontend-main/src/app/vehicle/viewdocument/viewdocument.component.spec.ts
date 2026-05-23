import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdocumentComponent } from './viewdocument.component';

describe('ViewdocumentComponent', () => {
  let component: ViewdocumentComponent;
  let fixture: ComponentFixture<ViewdocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewdocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
