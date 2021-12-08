import { TestBed } from '@angular/core/testing';

import { WebBluetoothService } from './web-bluetooth.service';

describe('WebBluetoothService', () => {
  let service: WebBluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebBluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
