import { TestBed } from '@angular/core/testing';

import { PartchangeService } from './partchange.service';

describe('PartchangeService', () => {
  let service: PartchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
