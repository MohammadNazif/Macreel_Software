// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-employee-list',
//   standalone: false,
//   templateUrl: './employee-list.component.html',
//   styleUrl: './employee-list.component.css'
// })
// export class EmployeeListComponent {

// }
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';


@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})

export class EmployeeListComponent implements OnInit {

  displayedColumns: string[] = ['srNo','empCode', 'empName','designationName', 'empEmail', 'Contact', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0; // for paginator
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: ManageEmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  // Fetch employees from API via service
  getEmployees(pageNumber: number = 1, pageSize: number = this.pageSize, searchText: string = this.searchText) {
    this.employeeService.getAllEmployees(pageNumber, pageSize, searchText).subscribe((res:any) => {
      if (res.success) {
        this.dataSource.data = res.data; 
        this.totalRecords = res.totalRecords || res.data.length; // API should return totalRecords for pagination
        this.dataSource.paginator = this.paginator;
      }
    }, (err:any) => {
      console.error('Error fetching employees', err);
    });
  }

  // Search input
  applyFilter(event: any) {
    this.searchText = event.target.value.trim();
    this.pageIndex = 0; // reset to first page when searching
    this.getEmployees(1, this.pageSize, this.searchText);
  }

  // Paginator change
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEmployees(this.pageIndex + 1, this.pageSize, this.searchText);
  }

  editEmployee(emp: any) {
    console.log('Edit', emp);
    // Open edit modal or navigate to edit page
  }

  deleteEmployee(emp: any) {
    console.log('Delete', emp);
    // Call delete API
  }
}
