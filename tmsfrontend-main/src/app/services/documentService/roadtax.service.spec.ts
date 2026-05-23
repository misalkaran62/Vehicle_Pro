import { TestBed } from '@angular/core/testing';

import { RoadtaxService } from './roadtax.service';

describe('RoadtaxService', () => {
  let service: RoadtaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoadtaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
