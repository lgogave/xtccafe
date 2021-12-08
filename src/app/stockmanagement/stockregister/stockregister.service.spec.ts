import { TestBed } from '@angular/core/testing';

import { StockregisterService } from './stockregister.service';

describe('StockregisterService', () => {
  let service: StockregisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockregisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
