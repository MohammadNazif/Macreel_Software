// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-all-employee-leave-list',
//   standalone: false,
//   templateUrl: './all-employee-leave-list.component.html',
//   styleUrl: './all-employee-leave-list.component.css'
// })
// export class AllEmployeeLeaveListComponent {

// }
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

  displayedColumns: string[] = ['srNo', 'empCode', 'empName', 'designation', 'email', 'contact'];
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

  loadEmployees(pageNumber: number = 1, pageSize: number = 10, search: string = '') {
    this.empService.getAllEmployees(pageNumber, pageSize, search).subscribe(res => {
      if (res.success) {
        this.dataSource.data = res.data;
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
