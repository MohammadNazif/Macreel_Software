import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-requests',
  standalone: false,
  templateUrl: './leave-requests.component.html',
  styleUrl: './leave-requests.component.css'
})
export class LeaveRequestsComponent {
  displayedColumns: string[] = [
    'srNo',
    'name',
    'leaveName',
    'fromDate',
    'toDate',
    'appliedDate',
    'description',
    'status',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  pageNumber = 1;
  pageSize = 5;
  totalRecords = 0;
  searchTerm: string = '';
  allLeaves: any[] = [];
  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("");
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isModalOpen = false;
  statusForm!: FormGroup;

  constructor(
    private readonly leaveService: ManageLeaveService,
    private readonly fb:FormBuilder
  ) {
    this.statusForm = this.fb.group({
      id:null,
      status: ['', Validators.required],
      leaveCount: [null, [Validators.required, Validators.min(1)]]
    });
  }
  openModal(id:number) {
    const leave = this.allLeaves.find(x => x.id === id);
    if (!leave) return;
    this.statusForm.get('leaveCount')?.setValue(leave.leaveCount);
    this.statusForm.get('id')?.setValue(leave.id);
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.statusForm.reset();
  }

  onSubmitStatus() {
    debugger
    if (!this.statusForm.valid) {
      return;
    }
    const formValue = this.statusForm.value;
    //Call Api
    this.leaveService.UpdateLeaveStatus(formValue.id,formValue.leaveCount,formValue.status).subscribe({
          next: (res) => {
            if (res.statusCode === 200) {
              Swal.fire('Success', res.message, 'success');
              location.reload();
            } else {
              Swal.fire('Error', res.message, 'error');
            }
          },
          error: (err) => {
            Swal.fire('Error', err.error.errorMessage, 'error');
          }
        });
  }

  ngOnInit(): void {
    
    this.loadAssignedLeaves();
    // Server-side search subscription
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm = value?.trim() || '';
        this.pageNumber = 1; // reset page
        this.loadAssignedLeaves();
      });
  }

  // MUST be called on paginator event
  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAssignedLeaves();
  }


  loadAssignedLeaves(): void {
    this.leaveService
      .getAllLeaveRequests(this.searchTerm, this.pageNumber, this.pageSize)
      .subscribe({
        next: res => {
          if (res.success) {
            this.allLeaves = res.data;
            this.dataSource.data = res.data;
            this.totalRecords = res.totalRecords;
          }
        }
      });
  }
}
