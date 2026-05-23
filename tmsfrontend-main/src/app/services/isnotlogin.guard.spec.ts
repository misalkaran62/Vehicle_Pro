import { TestBed } from '@angular/core/testing';

import { IsnotloginGuard } from './isnotlogin.guard';

describe('IsnotloginGuard', () => {
  let guard: IsnotloginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsnotloginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
