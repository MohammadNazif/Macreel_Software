import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone:false,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  taskForm!: FormGroup;
  employees = ['Rohit', 'Aman', 'Neha', 'Priya'];

  attachment1: File | null = null;
  attachment2: File | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      srNo: [{ value: 'AUTO', disabled: true }],
      title: ['', Validators.required],
      employee: ['', Validators.required],
      completionDate: ['', Validators.required],
      description: ['', Validators.required]
    });
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

  if (type === 1) this.attachment1 = file;
  else if (type === 2) this.attachment2 = file;
}

// File input select
onFileSelect(event: any, type: number) {
  const file = event.target.files[0];
  if (!file) return;

  if (type === 1) this.attachment1 = file;
  else if (type === 2) this.attachment2 = file;
}


  submit() {
    if (this.taskForm.invalid) return;

    const payload = {
      ...this.taskForm.getRawValue(),
      attachment1: this.attachment1,
      attachment2: this.attachment2
    };

    console.log(payload);
  }
}
