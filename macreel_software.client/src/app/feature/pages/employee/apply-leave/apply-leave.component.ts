import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';
import Swal from 'sweetalert2';
import { LeaveBalance, LeaveRequest, LeaveRow } from '../../../../core/models/interface';

@Component({
  selector: 'app-apply-leave',
  standalone: false,
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent {

  displayedColumns: string[] = [
    'srNo',
    'appliedDate',
    'fromDate',
    'toDate',
    'leaveName',
    'description',
    'status'
  ];

  dataSource = new MatTableDataSource<any>([]);
  pageNumber = 1;
  pageSize = 5;
  totalRecords = 0;
  allLeaves: any[] = [];
  searchTerm: string = ''
  leaveForm!: FormGroup
  leaveTypeList: LeaveRow[] = [];
  selectedFile: File | null = null
  fileError: string | null = null
  leaveBalanceList: LeaveBalance[] = [];
  // for cards
  totalLeave: Record<string, number> = {};
  remainingLeave: Record<string, number> = {};
  unapprovedLeave: Record<string, number> = {};
  leaveRequests: LeaveRequest[] = []
  // Leave requests list
  filteredRequests: LeaveRequest[] = []
  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("")
  Math = Math
  // For cleanup
  private readonly destroy$ = new Subject<void>()
  constructor(
    private readonly fb: FormBuilder,
    private readonly leaveService: ManageLeaveService) {
    this.leaveForm = this.fb.group(
      {
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        leaveType: ['', Validators.required],
        description: ['']
      },
      {
        validators: this.dateRangeValidator
      }
    );
  }

  dateRangeValidator(form: AbstractControl) {
    const fromDate = form.get('fromDate')?.value;
    const toDate = form.get('toDate')?.value;

    if (!fromDate || !toDate) {
      return null; // required validator handles this
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    return to >= from ? null : { invalidDateRange: true };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files.length > 0) {
      const file = input.files[0]

      // Optional validation (size: 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.fileError = 'File size must be less than 2MB'
        this.selectedFile = null
        return
      }

      this.fileError = null
      this.selectedFile = file
    }
  }


  getAllLeaveTypes() {
    this.leaveService.getAllLeave().subscribe({
      next: (res) => {
        if (res.success) {
          this.leaveTypeList = res.data
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadLeaveBalance();
    this.getAllLeaveTypes();
    this.loadAppliedLeaves()
    // Server-side search subscription
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm = value?.trim() || '';
        this.pageNumber = 1; // reset page
        this.loadAppliedLeaves();
      });
  }
  loadLeaveBalance(): void {
    this.leaveService.getLeaveBalance().subscribe({
      next: (res) => {
        if (res?.data) {
          this.leaveBalanceList = res.data;
          this.mapLeaveBalance(res.data);
        }
      }
    });
  }
  mapLeaveBalance(data: LeaveBalance[]): void {
    this.totalLeave = {};
    this.remainingLeave = {};
    this.unapprovedLeave = {};

    data.forEach(item => {
      this.totalLeave[item.leaveType] = item.assignedLeave;
      this.remainingLeave[item.leaveType] = item.remainingLeave;

      // unapproved = assigned - (used + remaining)
      this.unapprovedLeave[item.leaveType] =
        item.assignedLeave - (item.usedLeave + item.remainingLeave);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Load leave requests (mock data)
  loadAppliedLeaves(): void {
    this.leaveService.getAppliedLeaves(this.searchTerm, this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        if (res.success) {
          // clean data
          this.allLeaves = res.data.map((x: any) => ({
            ...x,
            leaveName: x.leaveName?.trim()
          }));

          this.totalRecords = res.totalRecords;
          this.applyPagination();
        }
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.leaveForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  // Submit leave request
  onSubmit(): void {
    if (this.leaveForm.invalid) {
      return;
    }

    const formValue = this.leaveForm.value;

    const formData = new FormData();
    formData.append('fromDate', formValue.fromDate);
    formData.append('toDate', formValue.toDate);
    formData.append('leaveTypeId', formValue.leaveType);
    formData.append('description', formValue.description);

    // call API
    this.leaveService.applyLeave(formData).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          Swal.fire('Success', res.message, 'success');
          this.resetForm();
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', err.error.errorMessage, 'error');
      }
    });
  }

  // Reset form
  resetForm(): void {
    this.leaveForm.reset()
  }

  // ================= PAGINATION =================
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.applyPagination();
  }

  // Change page size
  onPageSizeChange(): void {
    this.pageSize = Number.parseInt(this.pageSizeControl.value || "10", 10)
    this.pageNumber = 1
    this.applyPagination()
  }

  // Apply pagination
  applyPagination(): void {
    const start = (this.pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = this.allLeaves.slice(start, end);
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
