import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
interface LeaveRequest {
  id: number
  appliedDate: Date
  fromDate: Date
  toDate: Date
  leaveType: string
  description: string
  status: "Pending" | "Approved" | "Rejected"
}
@Component({
  selector: 'app-apply-leave',
  standalone: false,
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'srNo',
    'appliedDate',
    'fromDate',
    'toDate',
    'leaveType',
    'description',
    'status'
  ];


  pageSize = 5;
  pageNumber = 1;
  totalRecords = 0;
  searchText = '';
  leaveForm!: FormGroup

  // Leave requests list
  leaveRequests: LeaveRequest[] = []
  filteredRequests: LeaveRequest[] = []

  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("")

  Math = Math

  // For cleanup
  private readonly destroy$ = new Subject<void>()

  constructor(private readonly fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
      leaveType: ["", Validators.required],
      description: [""],
    })
  }

  ngOnInit(): void {
    this.loadLeaveRequests()
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchValue) => {
        // this.applyFilter(searchValue || "")
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Load leave requests (mock data)
  loadLeaveRequests(): void {
    const mockData: LeaveRequest[] = [
      {
        id: 1,
        appliedDate: new Date(),
        fromDate: new Date('2026-01-20'),
        toDate: new Date('2026-01-22'),
        leaveType: 'CL',
        description: 'Family function',
        status: 'Pending'
      }
    ];

    this.leaveRequests = mockData;
    this.totalRecords = mockData.length;
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.leaveForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  // Submit leave request
  onSubmit(): void {
    if (!this.leaveForm.valid) {
      return
    }

    const formValue = this.leaveForm.value
    const newRequest: LeaveRequest = {
      id: this.leaveRequests.length + 1,
      appliedDate: new Date(),
      fromDate: new Date(formValue.fromDate),
      toDate: new Date(formValue.toDate),
      leaveType: formValue.leaveType,
      description: formValue.description,
      status: "Pending",
    }

    this.leaveRequests.unshift(newRequest)
    this.filteredRequests = [...this.leaveRequests]
    this.totalRecords = this.leaveRequests.length
    this.resetForm()
    this.pageNumber = 1
    this.searchControl.setValue("")
    this.applyPagination()
  }

  // Reset form
  resetForm(): void {
    this.leaveForm.reset()
  }

  // ================= SEARCH =================
  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim();
    this.pageNumber = 1;
    // this.loadDesignations();
  }

  // ================= PAGINATION =================
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
  }


  // Change page size
  onPageSizeChange(): void {
    this.pageSize = Number.parseInt(this.pageSizeControl.value || "10", 10)
    this.pageNumber = 1
    this.applyPagination()
  }

  // Apply pagination
  applyPagination(): void {
    const startIndex = (this.pageNumber - 1) * this.pageSize
    const endIndex = startIndex + this.pageSize
    this.filteredRequests = this.leaveRequests.slice(startIndex, endIndex)
  }

  // Next page
  nextPage(): void {
    if (this.pageNumber * this.pageSize < this.totalRecords) {
      this.pageNumber++
      this.applyPagination()
    }
  }

  // Previous page
  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--
      this.applyPagination()
    }
  }
}
