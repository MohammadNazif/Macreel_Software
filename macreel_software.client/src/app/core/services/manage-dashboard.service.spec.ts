import { TestBed } from '@angular/core/testing';

import { ManageDashboardService } from './manage-dashboard.service';

describe('ManageDashboardService', () => {
  let service: ManageDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
