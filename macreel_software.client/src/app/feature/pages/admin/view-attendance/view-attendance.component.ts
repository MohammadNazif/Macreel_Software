import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Month {
  label: string;
  value: string;
}

@Component({
  selector: 'app-view-attendance',
  standalone:false,
  templateUrl: './view-attendance.component.html'
})
export class ViewAttendanceComponent implements OnInit {
  filterForm!: FormGroup;
  months: Month[] = [
    { label: 'January', value: '01' }, { label: 'February', value: '02' },
    { label: 'March', value: '03' }, { label: 'April', value: '04' },
    { label: 'May', value: '05' }, { label: 'June', value: '06' },
    { label: 'July', value: '07' }, { label: 'August', value: '08' },
    { label: 'September', value: '09' }, { label: 'October', value: '10' },
    { label: 'November', value: '11' }, { label: 'December', value: '12' }
  ];
  years: number[] = [];
  
  attendanceList: any[] = [];
  attendanceSummary: any = null;
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      empCode: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });

    const currentYear = new Date().getFullYear();
    for(let i=currentYear; i>=currentYear-10; i--){
      this.years.push(i);
    }
  }

  loadAttendance() {
    if (this.filterForm.invalid) return;

    this.isLoading = true;
    this.attendanceList = [];
    this.attendanceSummary = null;

    // Simulate API call
    setTimeout(() => {
      // Sample data, replace with API
      this.attendanceList = [
        { date: new Date(), day: 'Monday', status: 'Present', inTime: '09:00', outTime: '18:00' },
        { date: new Date(), day: 'Tuesday', status: 'Absent', inTime: '', outTime: '' },
        { date: new Date(), day: 'Wednesday', status: 'Half Day', inTime: '09:00', outTime: '13:00' }
      ];

      // Summary calculation
      this.attendanceSummary = {
        total: this.attendanceList.length,
        present: this.attendanceList.filter(a => a.status === 'Present').length,
        absent: this.attendanceList.filter(a => a.status === 'Absent').length,
        halfDay: this.attendanceList.filter(a => a.status === 'Half Day').length
      };

      this.isLoading = false;
    }, 1000);
  }
}
