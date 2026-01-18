import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TaskService } from '../../../../core/services/add-task.service';

import { PaginatedList } from '../../../../core/utils/paginated-list';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TableColumn, Task } from '../../../../core/models/interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-view-task',
  standalone:false,
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  searchForm!: FormGroup;
  paginator!: PaginatedList<Task>;

  taskColumns: TableColumn<Task>[] = [
    { key: 'title', label: 'Task' },
    { key: 'assignedBy', label: 'Assigned By' },
    { key: 'assignedDate', label: 'Assigned Date', type: 'date' },
    { key: 'completedDate', label: 'Completion Date', type: 'date' },
    { key: 'taskStatus', label: 'Status' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService : TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({ search: [''] });

    this.paginator = new PaginatedList<Task>(
      20,
      (search, page, size) => this.taskService.getTasks(search, page, size)
    );

    this.paginator.load();

    this.searchForm.get('search')!.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(search => {
      this.paginator.reset();
      this.paginator.load(search);
    });
  }

  onScroll(event: Event): void {
    this.paginator.handleScroll(event, this.searchForm.value.search);
  }
  
onEdit(task: Task) {
  console.log('Edit task:', task);

  this.router.navigate(['/home/admin/add-task'], {
    state: { task }
  });
}

  onDelete(task: Task) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete task "${task.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Task has been deleted.', 'success');
            this.paginator.reset();
            this.paginator.load(this.searchForm.value.search);
          },
          error: (err) => {
            Swal.fire('Error', err?.error?.message || 'Failed to delete task', 'error');
          }
        });
      }
    });
  }
}
