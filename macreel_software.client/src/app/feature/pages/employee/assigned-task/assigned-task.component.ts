import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../../../../core/services/add-task.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-assigned-task',
  standalone: false,
  templateUrl: './assigned-task.component.html',
  styleUrl: './assigned-task.component.css'
})
export class AssignedTaskComponent {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'srNo',
    'title',
    'assignedBy',
    'assignedDate',
    'completionDate',
    'taskStatus',
    'action'
  ];
  pageSize = 5;
  pageNumber = 1;
  totalRecords = 0;
  searchTerm = '';

  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("")

  constructor(
    private readonly taskservice: TaskService
  ) { }

  ngOnInit(): void {
    this.loadAssignedTasks();
    // Server-side search subscription
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm = value?.trim() || '';
        this.pageNumber = 1; // reset page
        this.loadAssignedTasks();
      });
  }

  // MUST be called on paginator event
  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAssignedTasks();
  }


  loadAssignedTasks(): void {
    this.taskservice
      .getAssignedTasks(this.searchTerm, this.pageNumber, this.pageSize)
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
