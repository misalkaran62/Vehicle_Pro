import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDocumentDialogComponent } from './update-document-dialog.component';

describe('UpdateDocumentDialogComponent', () => {
  let component: UpdateDocumentDialogComponent;
  let fixture: ComponentFixture<UpdateDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDocumentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
