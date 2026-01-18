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
   
  }
}
