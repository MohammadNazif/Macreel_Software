// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-assign-leave',
//   standalone: false,
//   templateUrl: './assign-leave.component.html',
//   styleUrl: './assign-leave.component.css'
// })
// export class AssignLeaveComponent {

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';
import Swal from 'sweetalert2';

interface Employee {
  id: number;
  empCode: string;
  empName: string;
  designationName: string;
  mobile: string;
  emailId: string;
  dateOfJoining: string;
}

interface Leave {
  id: number;
  leaveName: string;
  description: string;
  noOfLeave?: number;
  isSelected?: boolean;
}

@Component({
  selector: 'app-assign-leave',
  standalone: false,
  templateUrl: './assign-leave.component.html',
  styleUrl: './assign-leave.component.css'
})

export class AssignLeaveComponent implements OnInit {

  employees: Employee[] = [];
  selectedEmployeeId: number | null = null;
  selectedEmployee: Employee | null = null;
  isLoading: boolean = false;

  displayedColumns: string[] = ['select', 'noOfLeave', 'leaveName', 'description'];
  dataSource = new MatTableDataSource<Leave>();

  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empService: ManageEmployeeService,
    private leaveService: ManageLeaveService
  ) { }

  ngOnInit() {
    this.loadEmployees();
  }

  // Load all employees for dropdown
  loadEmployees() {
    this.isLoading = true;
    this.empService.getAllEmployees(null, null, '').subscribe({
      next: (res: any) => {
        this.employees = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // Employee selection change
  onEmployeeChange() {
    if (!this.selectedEmployeeId) {
      this.selectedEmployee = null;
      this.dataSource.data = [];
      return;
    }

    this.isLoading = true;
    this.empService.getEmployeeById(this.selectedEmployeeId).subscribe({
      next: (res: any) => {
        this.selectedEmployee = res.data[0];
        this.isLoading = false;
        this.loadLeaveList();
      },
      error: () => this.isLoading = false
    });
  }

  // Load leaves dynamically from API
  loadLeaveList() {
    this.leaveService.getAllLeave(this.searchTerm, this.pageIndex + 1, this.pageSize)
      .subscribe((res: any) => {
        this.dataSource.data = res.data.map((l: Leave) => ({
          ...l,
          noOfLeave: 0,
          isSelected: false
        }));
        this.totalRecords = res.totalRecords;
        this.dataSource._updateChangeSubscription();
      });
  }

 resetForm() {
  this.selectedEmployeeId = null;
  this.selectedEmployee = null;
  this.dataSource.data = [];
  this.pageIndex = 0;
}


  // Pagination
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadLeaveList();
  }

  // Checkbox toggle
  toggleSelection(row: Leave) {
    row.isSelected = !row.isSelected;
  }

  // Submit assigned leaves
  submitAssignedLeave() {
    if (!this.selectedEmployeeId) {
     Swal.fire({
  icon: 'warning',
  title: 'Oops...',
  text: 'Please select an employee first!'
});
      return;
    }

    const selectedLeaves = this.dataSource.data.filter(l => l.isSelected);
    if (selectedLeaves.length === 0) {
      Swal.fire({
  icon: 'warning',
  title: 'No Leave Selected',
  text: 'Please select at least one leave!'
});

      return;
    }

    // ✅ Payload as required by API
    const payload = {
      employeeId: this.selectedEmployeeId,
      leave: selectedLeaves.map(l => l.id).join(","),
      leaveNo: selectedLeaves.map(l => l.noOfLeave || 0).join(",")
    };

    console.log("Payload to API:", payload);

    this.leaveService.assignLeaveToEmployee(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
         Swal.fire({
  icon: 'success',
  title: 'Success',
  text: res.message || 'Leave assigned successfully!'
});

       this.resetForm();   // reset table
        } else {
          Swal.fire({
  icon: 'error',
  title: 'Failed',
  text: 'Failed to assign leave.'
});
        }
      },
      error: (err) => {
        console.error(err);
       Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'Leave assignment already exists for this employee.'
});

      }
    });
  }

  // Search/filter
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.pageIndex = 0;
    this.loadLeaveList();
  }
}
