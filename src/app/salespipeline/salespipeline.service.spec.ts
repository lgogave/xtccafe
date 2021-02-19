import { TestBed } from '@angular/core/testing';

import { SalespipelineService } from './salespipeline.service';

describe('SalespipelineService', () => {
  let service: SalespipelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalespipelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
