import { TaskService } from './../../../../core/services/add-task.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';

@Component({
  selector: 'app-add-task',
  standalone:false,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  taskForm!: FormGroup;
  employees:any = [];

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
      srNo: ['',Validators.required],
      title: ['', Validators.required],
      employee: ['', Validators.required],
      completionDate: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.loadEmployees();
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
  
  console.log(formValue)
  const payload: any = {
    title: formValue.title,
    description: formValue.description,
    CompletedDate: formValue.completionDate,
    empId: formValue.employee?.id,
    empName: formValue.employee?.empName
  }

  // If you need file upload (multipart)
  const formData = new FormData();
  formData.append('empId', payload.empId);
  formData.append('empName', payload.empName);
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('CompletedDate', payload.CompletedDate);

   if (this.attachment1) {
    formData.append('document1', this.attachment1);
    formData.append('document1Path', this.attachment1Name);
  }

  if (this.attachment2) {
    formData.append('document2', this.attachment2);
    formData.append('document2Path', this.attachment2Name);
  }
  
   for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
  }
  // now send
  this.taskService.addTask(formData).subscribe(res => {
    console.log(res);
  });
}

 
loadEmployees(pageNumber: number = 1, pageSize: number = 10, search: string = '') {
  this.empservice.getAllEmployees(pageNumber, pageSize, search).subscribe(res => {
    if (res.success) {
      this.employees = res.data;   
      console.log("RES",this.employees)// correct way for dropdown
    }
    
  });
}
  
}
