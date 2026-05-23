import { TestBed } from '@angular/core/testing';

import { PucService } from './puc.service';

describe('PucService', () => {
  let service: PucService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PucService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
