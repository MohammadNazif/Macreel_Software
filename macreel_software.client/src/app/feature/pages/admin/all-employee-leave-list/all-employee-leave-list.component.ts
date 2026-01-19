
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';

@Component({
  selector: 'app-all-employee-leave-list',
  standalone: false,
  templateUrl: './all-employee-leave-list.component.html',
  styleUrl: './all-employee-leave-list.component.css'
})
export class AllEmployeeLeaveListComponent implements OnInit {

  displayedColumns: string[] = ['srNo', 'empCode', 'empName', 'designation','CL','EL','SL'];

  dataSource = new MatTableDataSource<any>([]);
  totalRecords = 0;
  pageSize = 10;
  pageNumber = 1;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedEmployeeLeaves: any[] = [];
  selectedEmployeeName: string = '';
  showLeaveDropdown = false;

  constructor(
    private empService: ManageEmployeeService,
    private leaveService: ManageLeaveService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  // loadEmployees(pageNumber: number = 1, pageSize: number = 10, search: string = '') {
  //   this.empService.getAllEmployees(pageNumber, pageSize, search).subscribe(res => {
  //     if (res.success) {
  //       this.dataSource.data = res.data;
  //       this.totalRecords = res.totalRecords;
  //     }
  //   });
  // }

  loadEmployees(pageNumber: number = 1, pageSize: number = 10, search: string = '') {
  this.empService.getAllEmployees(pageNumber, pageSize, search).subscribe(res => {
    if (res.success) {

      const employees = res.data;

      // Har employee ke liye leave fetch karenge
      employees.forEach((emp: any) => {
        this.leaveService.getAssignedLeaveById(emp.id).subscribe(leaveRes => {

          if (leaveRes.success) {
            // Default values
            emp.clTotal = 0;
            emp.elTotal = 0;
            emp.slTotal = 0;

            leaveRes.data.forEach((leave: any) => {

              if (leave.leaveType === 'CL') {
                emp.clTotal = leave.noOfLeave;
              }
              if (leave.leaveType === 'EL') {
               
                emp.elTotal = leave.noOfLeave;
                 console.log('EL Leave for', emp.empName, ':', emp.elTotal);
              }
              if (leave.leaveType === 'SL') {
                emp.slTotal = leave.noOfLeave;
              }

            });

            // Table update karne ke liye
            this.dataSource.data = [...employees];
          }
        });
      });

      this.dataSource.data = employees;
      this.totalRecords = res.totalRecords;
    }
  });
}


  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadEmployees(this.pageNumber, this.pageSize, this.searchTerm);
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.pageNumber = 1;
    this.loadEmployees(this.pageNumber, this.pageSize, this.searchTerm);
  }

  // SHOW ASSIGNED LEAVE FOR SELECTED EMPLOYEE
  showLeave(empId: number, empName: string) {
    this.leaveService.getAssignedLeaveById(empId).subscribe(res => {
      this.selectedEmployeeLeaves = res.success ? res.data : [];
      this.selectedEmployeeName = empName;
      this.showLeaveDropdown = true; // open modal
    });
  }

  closeLeaveDropdown() {
    this.showLeaveDropdown = false; // close modal
  }
}
