import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../../../../core/services/add-task.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import { TableColumn } from '../../../../core/models/interface';




@Component({
  selector: 'app-assigned-task',
  standalone: false,
  templateUrl: './assigned-task.component.html',
  styleUrl: './assigned-task.component.css',
})
export class AssignedTaskComponent {
  dataSource = new MatTableDataSource<any>();
  selectedProjectId: number | null = null;
  statusForm!: FormGroup;
  isModalOpen = false;
  selectedFile1: any;
  selectedFile2: any;
  selectedTask: any;
  pageSize = 10;
  pageNumber = 1;
  totalRecords = 0;
  searchTerm = '';
 pages!: TableColumn<any>[];
  pageSizeControl = new FormControl<string>('10');
  searchControl = new FormControl<string>('');
    @ViewChild('statustemplate', { static: true }) statustemplate!: TemplateRef<any>;
  constructor(
    private readonly taskservice: TaskService,
    private readonly fb: FormBuilder,
    private readonly employeeService: ManageEmployeeService,
  ) {
    this.statusForm = this.fb.group({
      id: null,
      status: ['', Validators.required],

      leaveCount: [null, [Validators.required, Validators.min(1)]],
    });
  }


  

  
  ngOnInit(): void {

       this.pages = [
        { key: 'title', label: 'Title' ,align:'center'},
        { key: 'assignedByName', label: 'Assigned By' ,align:'center'},
             { key: 'assignedDate', label: 'Assigned To' ,align:'center',type:'date'},
        { key: 'completedDate', label: 'Completion Date' ,align:'center',type:'date'},
             { key: 'adminTaskStatus', label: 'Status By Admin' ,align:'center'},
             { key: 'taskStatus', label: 'Status By Employee' ,align:'center'},
        {
          key: 'taskStatus',
          label: 'Action',
          type : 'custom',
          template: this.statustemplate
        }
       
      ];
    this.loadAssignedTasks();
    // Server-side search subscription
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.searchTerm = value?.trim() || '';
        this.pageNumber = 1; // reset page
        this.loadAssignedTasks();
      });

    this.statusForm = this.fb.group({
      taskStatus: [{ value: '', disabled: true }],
      taskTitle: [{ value: '', disabled: true }],
      assignedDate: [{ value: '', disabled: true }],
      completedDate: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      comment: [''],
      isCompleted: [0],
      document1: [''],
      document2: [''],
    });
  }
  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    return dateStr.split('T')[0]; // yyyy-MM-dd
  }

  openModal(projectId: number) {
    this.selectedProjectId = projectId; // now works fine
    this.isModalOpen = true;

    this.employeeService.getAssignedTaskById(projectId).subscribe((res) => {
      if (res.success && res.data?.length) {
        const task = res.data[0];

        this.statusForm.patchValue({
          taskStatus: task.taskStatus === 0 ? 'Pending' : 'Completed',
          taskTitle: task.taskTitle,
          assignedDate: this.formatDate(task.assignedDate),
          completedDate: this.formatDate(task.completedDate),
          description: task.description,
          isCompleted: task.taskStatus === 1,
        });
      }
    });
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile1 = target.files[0];
    }
  }

  onFileSelected2(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile2 = target.files[0];
    }
  }

  onSubmitStatus() {
    if (!this.statusForm.valid) {
      return;
    }
    const formValue = this.statusForm.value;
    const formData = new FormData();
    if (this.selectedProjectId) {
      formData.append('projectId', this.selectedProjectId.toString());
    }
    formData.append('empComment', formValue.comment || '');

    formData.append('empResponse', formValue.isCompleted ? 'true' : 'false');

    // formData.append('empResponse', formValue. || '');
    formData.append('isCompleted', formValue.isCompleted ? 'true' : 'false');

    // const fileInput1: any = document.querySelector(
    //   'input[type="file"]:nth-of-type(1)',
    // );
    // const fileInput2: any = document.querySelector(
    //   'input[type="file"]:nth-of-type(2)',
    // );

    // if (fileInput1 && fileInput1.files.length > 0) {
    //   formData.append('document1', fileInput1.files[0]);
    // }
    // if (fileInput2 && fileInput2.files.length > 0) {
    //   formData.append('document2', fileInput2.files[0]);
    // }


    formData.append('document1', this.selectedFile1);
    formData.append('document2', this.selectedFile2);
    this.employeeService.updateTaskStatus(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          Swal.fire('Success', res.message, 'success');
          this.closeModal();
          location.reload();
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: (err) => {
        Swal.fire(
          'Error',
          err.error?.errorMessage || 'Something went wrong',
          'error',
        );
      },
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
        next: (res) => {
          if (res.success) {
            this.dataSource.data = res.data;
            this.totalRecords = res.totalRecords;
          }
        },
      });
  }
}
