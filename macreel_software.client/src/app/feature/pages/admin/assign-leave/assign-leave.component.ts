import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';
import { TableColumn } from '../../../../core/models/interface';

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

  assignedLeaves: any[] = [];

  dataSource = new MatTableDataSource<Leave>([]);
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ✅ TABLE COLUMNS
  leaves: TableColumn<Leave>[] = [
    { key: 'isSelected', label: 'Select', type: 'checkbox', align: 'center' },
    { key: 'noOfLeave', label: 'No of Leaves', type: 'number', align: 'center' },
    { key: 'leaveName', label: 'Type' },
    { key: 'description', label: 'Description' }
  ];

  constructor(
    private readonly empService: ManageEmployeeService,
    private readonly leaveService: ManageLeaveService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }


  loadEmployees() {
    this.isLoading = true;
    this.empService.getAllEmployees(null, null, '').subscribe({
      next: (res: any) => {
        this.employees = res.data || [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }


  onEmployeeChange() {
    if (!this.selectedEmployeeId) {
      this.resetForm();
      return;
    }

    this.isLoading = true;

    this.empService.getEmployeeById(this.selectedEmployeeId).subscribe({
      next: (res: any) => {
        this.selectedEmployee = res.data?.[0] || null;

        this.leaveService.getAssignedLeaveById(this.selectedEmployeeId!).subscribe({
          next: (leaveRes: any) => {
            this.assignedLeaves = leaveRes.data || [];
            this.loadLeaveListWithAssigned();
          },
          error: () => {
            this.assignedLeaves = [];
            this.loadLeaveListWithAssigned();
          }
        });
      },
      error: () => (this.isLoading = false)
    });
  }


  loadLeaveListWithAssigned() {
    this.leaveService
      .getAllLeave(this.searchTerm, this.pageIndex + 1, this.pageSize)
      .subscribe((res: any) => {

        this.dataSource.data = (res.data || []).map((leave: Leave) => {
          const assigned = this.assignedLeaves.find(
            (a: any) => a.leaveType?.trim() === leave.leaveName?.trim()
          );

          return {
            ...leave,
            isSelected: !!assigned,
            noOfLeave: assigned ? assigned.noOfLeave : 0
          };
        });

        this.totalRecords = res.totalRecords || 0;
        this.isLoading = false;
      });
  }

  onTableCheckboxChange(event: { row: Leave; key: string; value: boolean }) {
    event.row.isSelected = event.value;


    if (!event.value) {
      event.row.noOfLeave = 0;
    }
  }

  onTableNumberChange(event: { row: Leave; key: string; value: number }) {
    event.row.noOfLeave = event.value;

    if (event.value > 0) {
      event.row.isSelected = true;
    }
  }


  submitAssignedLeave() {
    if (!this.selectedEmployeeId) {
      Swal.fire('Warning', 'Please select an employee first!', 'warning');
      return;
    }

    const selectedLeaves = this.dataSource.data.filter(l => l.isSelected);

    if (selectedLeaves.length === 0) {
      Swal.fire('Warning', 'Please select at least one leave!', 'warning');
      return;
    }

    const payload = {
      employeeId: this.selectedEmployeeId,
      leave: selectedLeaves.map(l => l.id).join(','),
      leaveNo: selectedLeaves.map(l => l.noOfLeave || 0).join(',')
    };

    this.leaveService.assignLeaveToEmployee(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          Swal.fire('Success', res.message || 'Leave assigned successfully!', 'success');
          this.resetForm();
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Something went wrong', 'error');
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadLeaveListWithAssigned();
  }


  applyFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.pageIndex = 0;
    this.loadLeaveListWithAssigned();
  }


  resetForm() {
    this.selectedEmployeeId = null;
    this.selectedEmployee = null;
    this.dataSource.data = [];
    this.pageIndex = 0;
  }
}
