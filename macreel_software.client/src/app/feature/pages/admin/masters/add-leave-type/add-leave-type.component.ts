import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ManageLeaveService } from '../../../../../core/services/manage-leave.service';
import { LeaveRow } from '../../../../../core/models/interface';

@Component({
  selector: 'app-add-leave-type',
  standalone: false,
  templateUrl: './add-leave-type.component.html',
  styleUrl: './add-leave-type.component.css'
})
export class AddLeaveTypeComponent implements OnInit {

  leaveForm!: FormGroup;

  displayedColumns: string[] = ['srNo', 'leaveName', 'description', 'action'];
  dataSource = new MatTableDataSource<LeaveRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageNumber = 1;
  pageSize = 5;
  totalRecords = 0;
  searchTerm = '';

  isEditMode = false;
  editId: number | null = null;
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly leaveService: ManageLeaveService
  ) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      leaveName: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.loadLeaveList();
  }

  // ================= LOAD LIST =================
  loadLeaveList() {
    this.leaveService
      .getAllLeave(this.searchTerm, this.pageNumber, this.pageSize)
      .subscribe(res => {
        if (res?.success) {
          const list = res.data || [];
          this.totalRecords = res.totalRecords || 0;

          this.dataSource.data = list.map((item: any, index: number) => ({
            srNo: (this.pageNumber - 1) * this.pageSize + index + 1,
            id: item.id,
            leaveName: item.leaveName,
            description: item.description
          }));
        }
      });
  }

  // ================= PAGINATION =================
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadLeaveList();
  }

  // ================= SEARCH =================
  applyFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.trim();
    this.pageNumber = 1;
    this.loadLeaveList();
  }

  // ================= ADD / UPDATE (JSON) =================
  onSubmit() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    // ✅ JSON payload
    const payload = {
      id: this.isEditMode ? this.editId : 0,
      leaveName: this.leaveForm.value.leaveName,
      description: this.leaveForm.value.description
    };

    this.isSubmitting = true;

    this.leaveService.insertLeave(payload).subscribe({
      next: res => {
        if (res?.status) { // backend me 'status' property check
          Swal.fire('Success', res.message, 'success');
          this.leaveForm.reset();
          this.isEditMode = false;
          this.editId = null;
          this.loadLeaveList();
        } else {
          Swal.fire('Error', res.message || 'Failed to save leave', 'error');
        }
        this.isSubmitting = false;
      },
      error: () => {
        Swal.fire('Error', 'Failed to save leave', 'error');
        this.isSubmitting = false;
      }
    });
  }

  // ================= EDIT =================
  onEdit(row: LeaveRow) {
    this.leaveService.getLeaveById(row.id).subscribe(res => {
      if (res?.success && res.data?.length) {
        const data = res.data[0];

        this.leaveForm.patchValue({
          leaveName: data.leaveName,
          description: data.description
        });

        this.isEditMode = true;
        this.editId = data.id;
      }
    });
  }

  // ================= DELETE =================
  onDelete(row: LeaveRow) {
    Swal.fire({
      title: `Delete ${row.leaveName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C5192F'
    }).then(result => {
      if (result.isConfirmed) {
        this.leaveService.deleteLeaveById(row.id).subscribe(() => {
          Swal.fire('Deleted', 'Leave deleted', 'success');
          this.loadLeaveList();
        });
      }
    });
  }
}
