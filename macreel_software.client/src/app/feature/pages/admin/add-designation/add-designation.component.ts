

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
import { ManageMasterdataService } from '../../../../core/services/manage-masterdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-designation',
  standalone: false,
  templateUrl: './add-designation.component.html',
  styleUrl: './add-designation.component.css'
})
export class AddDesignationComponent implements OnInit {

  designationName = '';
  editingDesignationId: number | null = null;

  displayedColumns: string[] = ['srNo', 'name', 'action'];
  // dataSource = new MatTableDataSource<DesignationElement>([]);

  pageSize = 5;
  pageNumber = 1;
  totalRecords = 0;
  searchText = '';

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private master: ManageMasterdataService) { }

  ngOnInit(): void {
    this.loadDesignations();
  }

  dataSource: DesignationElement[] = [];
  // ================= LOAD =================
  loadDesignations() {
    this.master
      .getDesignation(this.pageNumber, this.pageSize, this.searchText)
      .subscribe({
        next: (res) => {
          const data = res.data ?? [];

          this.totalRecords = res.totalRecords ?? 0;

          this.dataSource = data.map((item: any, index: number) => ({
            srNo: (this.pageNumber - 1) * this.pageSize + index + 1,
            id: item.id,
            name: item.designationName
          }));
        },
        error: () => {
          Swal.fire('Error', 'Failed to load designations', 'error');
        }
      });
  }

// ================= ADD / UPDATE =================
onSubmit() {
  if (!this.designationName.trim()) return;

  // ✅ Send payload exactly as API expects
  const payload = {
    id: this.editingDesignationId ?? 0,  // 0 for new designation
    designationName: this.designationName
  };

  this.master.addOrUpdateDesignation(payload).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: this.editingDesignationId
          ? 'Designation Updated'
          : 'Designation Added',
        timer: 1500,
        showConfirmButton: false
      });

      this.cancelEdit();
      this.loadDesignations();
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'Save failed', 'error');
    }
  });
}


  // ================= EDIT =================
  editDesignation(row: DesignationElement) {
    this.master.getDesignationById(row.id).subscribe({
      next: (res) => {

        // ✅ API response ke according
        if (res.success && res.data?.length) {

          const data = res.data[0];

          // ✅ FORM BIND
          this.designationName = data.designationName;

          // ✅ ID SET (MOST IMPORTANT)
          this.editingDesignationId = data.id;

        } else {
          Swal.fire('Error', 'Designation not found', 'error');
        }
      },
      error: () => {
        Swal.fire('Error', 'Failed to fetch designation', 'error');
      }
    });
  }

  cancelEdit() {
    this.designationName = '';
    this.editingDesignationId = null;
  }

  // ================= DELETE =================
  deleteDesignation(row: DesignationElement) {
    Swal.fire({
      title: `Are you sure you want to delete ${row.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C5192F'
    }).then(result => {
      if (result.isConfirmed) {
        this.master.deleteDesignationById(row.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Designation removed', 'success');
            this.loadDesignations();
          },
          error: () => {
            Swal.fire('Error', 'Delete failed', 'error');
          }
        });
      }
    });
  }

  // ================= SEARCH =================
  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim();
    this.pageNumber = 1;
    this.loadDesignations();
  }

  // ================= PAGINATION =================
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadDesignations();
  }
}

export interface DesignationElement {
  srNo: number;
  id: number;
  name: string;
}
