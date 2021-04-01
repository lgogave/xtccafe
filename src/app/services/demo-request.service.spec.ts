import { TestBed } from '@angular/core/testing';

import { DemoRequestService } from './demo-request.service';

describe('DemoRequestService', () => {
  let service: DemoRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
