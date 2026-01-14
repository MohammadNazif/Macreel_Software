import { TestBed } from '@angular/core/testing';

import { ManageLeaveService } from './manage-leave.service';

describe('ManageLeaveService', () => {
  let service: ManageLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
