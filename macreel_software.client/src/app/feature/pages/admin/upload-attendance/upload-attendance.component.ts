import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceService } from '../../../../core/services/upload-attendance.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-upload-attendance',
  standalone: false,
  templateUrl: './upload-attendance.component.html',
  styleUrls: ['./upload-attendance.component.css']
})
export class UploadAttendanceComponent {

  attendanceForm: FormGroup;
  selectedFile: File | null = null;
  isDragging = false;
    isSubmitting = false;
      successMsg = '';

  years = [2024, 2025, 2026];
 months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 }
];


  constructor(private fb: FormBuilder,
        private attendanceService: AttendanceService
    ) {
    this.attendanceForm = this.fb.group({
      year: ['', Validators.required],
      month: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.setFile(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  setFile(file: File) {
    this.selectedFile = file;
    this.attendanceForm.patchValue({ file });
  }



async submit() {
  // Validate form & file
  if (this.attendanceForm.invalid || !this.selectedFile) {
    return;
  }

  const formData = new FormData();
  formData.append('year', this.attendanceForm.value.year);
  formData.append('month', this.attendanceForm.value.month);
  formData.append('file', this.selectedFile);

  try {
    this.isSubmitting = true;

    const res = await this.attendanceService.uploadAttendance(formData);

    console.log("res", res);

    // Success SweetAlert
    await Swal.fire({
      title: 'Success!',
      text: 'Attendance uploaded successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    });

    // Reset form & clear file
    this.attendanceForm.reset();
    this.selectedFile = null;

  } catch (error) {
    console.error(error);

    // Error SweetAlert
    Swal.fire({
      title: 'Error!',
      text: 'Upload failed',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  } finally {
    this.isSubmitting = false;
  }
}

}
