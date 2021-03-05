import { TestBed } from '@angular/core/testing';

import { PotentialnatureService } from './potentialnature.service';

describe('PotentialnatureService', () => {
  let service: PotentialnatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotentialnatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
