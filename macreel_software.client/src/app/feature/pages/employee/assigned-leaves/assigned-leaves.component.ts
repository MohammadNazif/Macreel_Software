import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-assigned-leaves',
  standalone: false,
  templateUrl: './assigned-leaves.component.html',
  styleUrl: './assigned-leaves.component.css'
})
export class AssignedLeavesComponent {
  displayedColumns: string[] = [
    'srNo',
    'leaveName',
    'noOfLeaves'
  ];
  dataSource = new MatTableDataSource<any>([]);
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  searchTerm: string = '';
  allLeaves: any[] = [];
  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("");
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly leaveService: ManageLeaveService
  ) { }

  ngOnInit(): void {
    this.loadAssignedLeaves();
    // Server-side search subscription
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm = value?.trim() || '';
        this.pageNumber = 1; // reset page
        this.loadAssignedLeaves();
      });
  }

  // MUST be called on paginator event
  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAssignedLeaves();
  }


  loadAssignedLeaves(): void {
    this.leaveService
      .getAssignedLeaves(this.searchTerm, this.pageNumber, this.pageSize)
      .subscribe({
        next: res => {
          if (res.success) {
            this.dataSource.data = res.data;
            this.totalRecords = res.totalRecords;
          }
        }
      });
  }
}
