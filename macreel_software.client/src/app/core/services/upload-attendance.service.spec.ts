import { TestBed } from '@angular/core/testing';

import { UploadAttendanceService } from './upload-attendance.service';

describe('UploadAttendanceService', () => {
  let service: UploadAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
