import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assigned-leaves',
  standalone: false,
  templateUrl: './assigned-leaves.component.html',
  styleUrl: './assigned-leaves.component.css'
})
export class AssignedLeavesComponent {
dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'srNo',
    'leaveType',
    'noOfLeaves'
  ];
  pageSize = 5;
  pageNumber = 1;
  totalRecords = 0;
  searchText = '';

  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("")

    // ================= SEARCH =================
  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim();
    this.pageNumber = 1;
    // this.loadDesignations();
  }

  // ================= PAGINATION =================
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
  }


  // Change page size
  onPageSizeChange(): void {
    this.pageSize = Number.parseInt(this.pageSizeControl.value || "10", 10)
    this.pageNumber = 1
    this.applyPagination()
  }

  // Apply pagination
  applyPagination(): void {
    const startIndex = (this.pageNumber - 1) * this.pageSize
    const endIndex = startIndex + this.pageSize
    // this.filteredRequests = this.leaveRequests.slice(startIndex, endIndex)
  }

  // Next page
  nextPage(): void {
    if (this.pageNumber * this.pageSize < this.totalRecords) {
      this.pageNumber++
      this.applyPagination()
    }
  }
}
