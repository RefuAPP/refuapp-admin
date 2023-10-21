import { TestBed } from '@angular/core/testing';

import { RefugeService } from './refuge.service';

describe('RefugeService', () => {
  let service: RefugeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefugeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
