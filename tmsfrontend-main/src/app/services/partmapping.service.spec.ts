import { TestBed } from '@angular/core/testing';

import { PartmappingService } from './partmapping.service';

describe('PartmappingService', () => {
  let service: PartmappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartmappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
