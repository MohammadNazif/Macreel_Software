// import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';

// @Component({
//   selector: 'app-add-department',
//   standalone: false,
//   templateUrl: './add-department.component.html',
//   styleUrls: ['./add-department.component.css']
// })
// export class AddDepartmentComponent implements AfterViewInit{
//   displayedColumns: string[] = ['srNo', 'name', 'action'];
//   dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//   }
//    applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }

// }

// export interface PeriodicElement {
//  srNo: number;
//   name: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   { srNo: 1, name: 'Finance' },
//   { srNo: 2, name: 'Human Resources' },
//   { srNo: 3, name: 'IT Department' },
//   { srNo: 4, name: 'Human Resources' },
//   { srNo: 5, name: 'IT Department' },
//   { srNo: 6, name: 'Finance' },
//   { srNo: 7, name: 'Human Resources' },
//   { srNo: 8, name: 'IT Department' },
//   { srNo: 9, name: 'Human Resources' },
//   { srNo: 10, name: 'IT Department' },
// ];

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManageMasterdataService } from '../../../../core/services/manage-masterdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  standalone: false,
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {

  departmentName: string = '';
  editingDepartmentId: number | null = null;

  displayedColumns: string[] = ['srNo', 'name', 'action'];
  dataSource = new MatTableDataSource<DepartmentRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize: number = 5;
  pageNumber: number = 1;
  totalRecords: number = 0;
  searchText: string = '';

  constructor(private master: ManageMasterdataService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  // ================= LOAD DATA =================
  loadDepartments() {
    this.master.getDepartment(
      this.pageNumber,
      this.pageSize,
      this.searchText
    ).subscribe({
      next: (res) => {
        const list = res.data || [];
        this.totalRecords = res.totalRecords || 0;

        this.dataSource.data = list.map((item: any, index: number) => ({
          srNo: (this.pageNumber - 1) * this.pageSize + index + 1,
          id: item.id,
          name: item.departmentName || item.name
        }));
      },
      error: () => {
        Swal.fire('Error', 'Failed to load departments', 'error');
      }
    });
  }

  // ================= PAGINATION =================
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadDepartments();
  }

  // ================= SEARCH =================
  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim();
    this.pageNumber = 1;
    this.loadDepartments();
  }

  // ================= ADD / UPDATE =================
  onSubmit() {
    if (!this.departmentName.trim()) return;

    const payload = {
      id: this.editingDepartmentId || 0,
      departmentName: this.departmentName
    };

    this.master.addOrUpdateDepartment(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.editingDepartmentId
            ? 'Department updated'
            : 'Department added',
          timer: 1500,
          showConfirmButton: false
        });

        this.departmentName = '';
        this.editingDepartmentId = null;
        this.loadDepartments();
      },
      error: () => {
        Swal.fire('Error', 'Failed to save department', 'error');
      }
    });
  }

  // ================= EDIT =================
 editDepartment(row: DepartmentRow) {
  this.master.getDepartmentById(row.id).subscribe({
    next: (res) => {
      if (res.status && res.departmentListbyid?.length) {
        const dept = res.departmentListbyid[0];

        this.departmentName = dept.departmentName;
        this.editingDepartmentId = dept.id;
      }
    },
    error: () => {
      Swal.fire('Error', 'Failed to fetch department', 'error');
    }
  });
}


  // ================= DELETE =================
  deleteDepartment(row: DepartmentRow) {
    Swal.fire({
      title: `Are you sure you want to delete ${row.name}?`, 
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C5192F'
    }).then(result => {
      if (result.isConfirmed) {
        this.master.deleteDepartmentById(row.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              timer: 1200,
              showConfirmButton: false
            });
            this.loadDepartments();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete department', 'error');
          }
        });
      }
    });
  }
}

export interface DepartmentRow {
  srNo: number;
  id: number;
  name: string;
}
