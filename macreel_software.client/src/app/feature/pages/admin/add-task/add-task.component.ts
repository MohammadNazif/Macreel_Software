import { TaskService } from './../../../../core/services/add-task.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-task',
  standalone:false,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  taskForm!: FormGroup;
  employees:any = [];
   editTask: any = null;

   attachment1: File | null = null;
  attachment2: File | null = null;
  attachment1Name: string = '';
attachment2Name: string = '';
  totalRecords: any;
  dataSource: any;

  constructor(private fb: FormBuilder,
    private empservice : ManageEmployeeService,
    private taskService : TaskService
  ) {}

 ngOnInit(): void {
  this.taskForm = this.fb.group({
    id: [''],
    title: ['', Validators.required],
    employee: ['', Validators.required],
    completionDate: ['', Validators.required],
    description: ['', Validators.required]
  });

  this.loadEmployees();

  const state = history.state;

  console.log("state",state)
  if (state && state.task) {
    this.editTask = state.task;
    this.bindEditData();
  }
}
  onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

// Drop event
onFileDrop(event: DragEvent, type: number) {
  event.preventDefault();
  event.stopPropagation();
  const file = event.dataTransfer?.files[0];
  if (!file) return;

  if (type === 1) 
    {this.attachment1 = file;
    this.attachment1Name = file ? file.name : '';
    }

  else if (type === 2) 
  {
    this.attachment2 = file;
     this.attachment2Name = file ? file.name : '';
  }
}

// File input select
onFileSelect(event: any, type: number) {
  const file = event.target.files[0];
  if (!file) return;

   if (type === 1) 
    {this.attachment1 = file;
    this.attachment1Name = file ? file.name : '';
    }

  else if (type === 2) 
  {
    this.attachment2 = file;
     this.attachment2Name = file ? file.name : '';
  }
}




submit() {
  if (this.taskForm.invalid) return;

  const formValue = this.taskForm.getRawValue();

  const payload: any = {
    id: this.editTask?.id ?? 0,
    title: formValue.title,
    description: formValue.description,
    CompletedDate: formValue.completionDate,
    empId: formValue.employee?.id,
    empName: formValue.employee?.empName
  };

  // Build FormData
  const formData = new FormData();
  formData.append('id', payload.id.toString());
  formData.append('empId', payload.empId);
  formData.append('empName', payload.empName);
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('CompletedDate', payload.CompletedDate);


if (this.attachment1) {
  formData.append('document1', this.attachment1);
  formData.append('document1Path', this.attachment1Name);
} else if (this.attachment1Name) {
  formData.append('document1Path', this.attachment1Name);
}

if (this.attachment2) {
  formData.append('document2', this.attachment2);
  formData.append('document2Path', this.attachment2Name);
} else if (this.attachment2Name) {
  formData.append('document2Path', this.attachment2Name);
}


  for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
  }

  // Send request
  this.taskService.addTask(formData).subscribe({
    next: async (res) => {
      console.log(res);

      // Success SweetAlert
      await Swal.fire({
        title: 'Success!',
        text: 'Task saved successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Reset form & attachments
      this.taskForm.reset();
      this.attachment1 = null;
      this.attachment2 = null;
      this.attachment1Name = '';
      this.attachment2Name = '';
      this.editTask = null; // if you were editing
    },
    error: (err) => {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: err?.error?.message || 'Failed to save task',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}

 
loadEmployees(pageNumber: number = 1, pageSize: number = 10, search: string = '') {
  this.empservice.getAllEmployees(pageNumber, pageSize, search).subscribe(res => {
    if (res.success) {
      this.employees = res.data;   
      console.log("RES",this.employees)// correct way for dropdown
    }
    if (this.editTask) {
        this.bindEditData();
      }
    
  });
}
  

bindEditData() {
    this.attachment1Name = this.editTask.document1Path;
  this.attachment2Name = this.editTask.document2Path;
  this.taskForm.patchValue({
    id: this.editTask?.id ?? 0,
    title: this.editTask.title,
    description: this.editTask.description,
     completionDate: this.editTask.completedDate
      ? this.editTask.completedDate.substring(0, 10)  
      : '',
    employee: this.employees.find(
      (e: any) => e.id == this.editTask.empId
    )
  });

  // If you want to show existing attachments
  this.attachment1Name = this.editTask.document1Path || '';
  this.attachment2Name = this.editTask.document2Path || '';
}

}
