import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TaskService } from '../../../../core/services/add-task.service';
import { Task } from '../../../../core/models/employee.interface';


@Component({
  selector: 'app-view-task',
  standalone:false,
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  tasks: Task[] = [];
  isLoading = false;

  constructor(private taskService : TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (res: Task[]) => {
        this.tasks = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err?.error?.message || 'Failed to load tasks', 'error');
      }
    });
  }

  onView(task: Task) {
    Swal.fire({
      title: task.title,
      html: `
        <p><strong>Assigned By:</strong> ${task.assignedBy}</p>
        <p><strong>Assigned Date:</strong> ${new Date(task.assignedDate).toLocaleDateString()}</p>
        <p><strong>Completion Date:</strong> ${new Date(task.completionDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${task.status}</p>
      `
    });
  }

  onEdit(task: Task) {
    // Navigate to edit form (implement routing as needed)
    console.log('Edit task:', task);
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
            this.loadTasks();
          },
          error: (err) => {
            Swal.fire('Error', err?.error?.message || 'Failed to delete task', 'error');
          }
        });
      }
    });
  }
}
