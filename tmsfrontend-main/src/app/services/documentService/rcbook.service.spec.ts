import { TestBed } from '@angular/core/testing';

import { RcbookService } from './rcbook.service';

describe('RcbookService', () => {
  let service: RcbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
