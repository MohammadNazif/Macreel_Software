import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AttendanceService } from '../../../../core/services/upload-attendance.service';
import { PaginatedList } from '../../../../core/utils/paginated-list';
import { Attendance, TableColumn } from '../../../../core/models/interface';

interface Month {
  label: string;
  value: string;
}

@Component({
  selector: 'app-view-attendance',
  standalone: false,
  templateUrl: './view-attendance.component.html'
})
export class ViewAttendanceComponent implements OnInit {


  filterForm!: FormGroup;
  searchForm!: FormGroup;

  paginator!: PaginatedList<Attendance>;

  attendanceSummary: any = null;
  attendancedetails : any = null;
  isLoading = false;

  /* -------------------- Dropdown Data -------------------- */
  months: Month[] = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ];

  years: number[] = [];

  /* -------------------- Table Columns -------------------- */
attendanceColumns: TableColumn<Attendance>[] = [

  { key: 'attendanceDate', label: 'Date', type: 'date' },
  { key: 'status', label: 'Status' },
  { key: 'inTime', label: 'In Time' },
  { key: 'outTime', label: 'Out Time' },
 
];


  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {

    /* -------- Filter Form -------- */
    this.filterForm = this.fb.group({
      empCode: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });

    /* -------- Search Form -------- */
    this.searchForm = this.fb.group({
      search: ['']
    });

    /* -------- Year Dropdown -------- */
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 1; i--) {
      this.years.push(i);
    }

  }

  loadAttendance(): void {
    if (this.filterForm.invalid) {
      return;
    }

    this.isLoading = true;

    const payload = {
      empCode: this.filterForm.value.empCode?.trim(),
      month: this.filterForm.value.month,
      year: this.filterForm.value.year
    };

    this.attendanceService.getAttendance(payload).subscribe({
      next: (res) => {
        this.attendancedetails = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.attendancedetails = null;
        this.isLoading = false;
      }
    });
    this.attendanceService.getAttendanceSummary(payload).subscribe({
      next: (res) => {
        console.log("att",res.data)
        this.attendanceSummary = res.data[0];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.attendanceSummary = null;
        this.isLoading = false;
      }
    });
  }

  /* -------------------- Infinite Scroll -------------------- */
  onScroll(event: Event): void {
    this.paginator.handleScroll(event, this.searchForm.value.search);
  }
}
