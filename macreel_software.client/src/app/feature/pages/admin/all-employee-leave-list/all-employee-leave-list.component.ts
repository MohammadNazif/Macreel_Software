import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';

@Component({
  selector: 'app-all-employee-leave-list',
  standalone: false,
  templateUrl: './all-employee-leave-list.component.html',
  styleUrl: './all-employee-leave-list.component.css'
})
export class AllEmployeeLeaveListComponent implements OnInit {

  displayedColumns: string[] = ['srNo', 'empCode', 'empName', 'designation', 'CL', 'EL', 'SL'];

  dataSource = new MatTableDataSource<any>([]);
  totalRecords = 0;
  pageSize = 20;
  pageNumber = 1;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedEmployeeLeaves: any[] = [];
  selectedEmployeeName: string = '';
  showLeaveDropdown = false;

  constructor(private leaveService: ManageLeaveService) {}

  ngOnInit(): void {
    this.loadAssignedLeave(this.pageNumber, this.pageSize, this.searchTerm);
  }

  // ✅ BACKEND PAGINATION + SEARCH (MAIN FUNCTION)
  loadAssignedLeave(pageNumber: number, pageSize: number, search: string) {
    this.leaveService.getAllAssignedLeave(search, pageNumber, pageSize).subscribe({
      next: (res) => {
        if (res.success) {
          this.dataSource.data = res.data;
          this.totalRecords = res.totalRecords;
        }
      },
      error: (err) => {
        console.error('Error fetching assigned leave:', err);
      }
    });
  }

  // ✅ When user changes page → API HIT
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAssignedLeave(this.pageNumber, this.pageSize, this.searchTerm);
  }

  // ✅ When user types search → API HIT
  onSearchChange(event: any) {
    this.searchTerm = event.target.value?.trim();
    this.pageNumber = 1; // reset to first page
    this.loadAssignedLeave(this.pageNumber, this.pageSize, this.searchTerm);
  }

  // Show leave in modal (NO EXTRA API CALL)
  showLeave(emp: any) {
    this.selectedEmployeeLeaves = [
      { leaveType: 'CL', noOfLeave: emp.clTotal },
      { leaveType: 'EL', noOfLeave: emp.elTotal },
      { leaveType: 'SL', noOfLeave: emp.slTotal }
    ];

    this.selectedEmployeeName = emp.empName;
    this.showLeaveDropdown = true;
  }

  closeLeaveDropdown() {
    this.showLeaveDropdown = false;
  }
}
