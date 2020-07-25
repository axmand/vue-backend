import { TestBed } from '@angular/core/testing';

import { DataserviveService } from './dataservive.service';

describe('DataserviveService', () => {
  let service: DataserviveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataserviveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
