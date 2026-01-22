
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {  employee, TableColumn } from '../../../../core/models/interface';


@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})

export class EmployeeListComponent implements OnInit {

  displayedColumns: string[] = ['srNo', 'empCode', 'empName', 'designationName', 'empEmail', 'Contact', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  data: any = [];
  totalRecords = 0;
  pageSize = 20;
  pageIndex = 0; // for paginator
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: ManageEmployeeService, private router: Router) { }

  editEmployee(emp: any) {

    this.router.navigate(['/home/edit-employee', emp.id]);
  }
  employee: TableColumn<any>[] = [
    { key: 'empCode', label: 'Emp Code' },
    { key: 'empName', label: 'Emp Name' },
    { key: 'designationName', label: 'Designation' },
    { key: 'emailId', label: 'Email' },
    { key: 'mobile', label: 'Mobile' }


  ]
  ngOnInit(): void {
    this.getEmployees();
  }

  // Fetch employees from API via service
  getEmployees(pageNumber: number = 1, pageSize: number = this.pageSize, searchText: string = this.searchText) {
    this.employeeService.getAllEmployees(pageNumber, pageSize, searchText).subscribe((res: any) => {
      if (res.success) {
        this.data = res.data;
        this.totalRecords = res.totalRecords || res.data.length; 
        // API should return totalRecords for pagination
        this.dataSource.paginator = this.paginator;
      }
    }, (err: any) => {
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

  // editEmployee(emp: any) {
  //   console.log('Edit', emp);
  //   // Open edit modal or navigate to edit page
  // }


  deleteEmployee(id: any) {
    console.log('Delete', id);
      Swal.fire({
      title: 'Are you sure?',
      text: 'This employee will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C5192F',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result)=>{
      if (result.isConfirmed) {

        this.employeeService.deleteDepartmentById(id.id).subscribe({
          next: (res: any) => {

            if (res.status === true) {

              Swal.fire({
                title: 'Deleted!',
                text: res.message || 'Employee deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                // 🔄 FULL PAGE REFRESH
                window.location.reload();
              });

            } else {
              Swal.fire('Error', res.message || 'Delete failed', 'error');
            }

          },
          error: () => {
            Swal.fire('Error', 'Something went wrong!', 'error');
          }
        });

      }
    })
  }
}