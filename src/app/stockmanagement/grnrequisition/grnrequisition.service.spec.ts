import { TestBed } from '@angular/core/testing';

import { GrnrequisitionService } from './grnrequisition.service';

describe('GrnrequisitionService', () => {
  let service: GrnrequisitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnrequisitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
