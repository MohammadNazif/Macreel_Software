import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../../../../core/services/add-task.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigned-task',
  standalone: false,
  templateUrl: './assigned-task.component.html',
  styleUrl: './assigned-task.component.css'
})
export class AssignedTaskComponent {
  dataSource = new MatTableDataSource<any>();
  statusForm!:FormGroup;
  isModalOpen = false;
  displayedColumns: string[] = [
    'srNo',
    'title',
    'assignedBy',
    'assignedDate',
    'completionDate',
    'taskStatus',
    'action'
  ];
  pageSize = 10;
  pageNumber = 1;
  totalRecords = 0;
  searchTerm = '';

  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("")

  constructor(
    private readonly taskservice: TaskService,
    private readonly fb:FormBuilder
  ) {this.statusForm = this.fb.group({
      id:null,
      status: ['', Validators.required],
      leaveCount: [null, [Validators.required, Validators.min(1)]]
    }); }

    openModal(id:number) {
        // const leave = this.allLeaves.find(x => x.id === id);
        // if (!leave) return;
        // this.statusForm.get('leaveCount')?.setValue(leave.leaveCount);
        // this.statusForm.get('id')?.setValue(leave.id);
        this.isModalOpen = true;
      }
      closeModal() {
        this.isModalOpen = false;
        this.statusForm.reset();
      }
    
      onSubmitStatus() {
        debugger
        if (!this.statusForm.valid) {
          return;
        }
        const formValue = this.statusForm.value;
        //Call Api
        this.taskservice.UpdateTaskStatus().subscribe({
              next: (res) => {
                if (res.statusCode === 200) {
                  Swal.fire('Success', res.message, 'success');
                  location.reload();
                } else {
                  Swal.fire('Error', res.message, 'error');
                }
              },
              error: (err) => {
                Swal.fire('Error', err.error.errorMessage, 'error');
              }
            });
      }

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
