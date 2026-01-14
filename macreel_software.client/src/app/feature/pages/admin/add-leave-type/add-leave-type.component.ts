// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-leave-type',
//   standalone: false,
//   templateUrl: './add-leave-type.component.html',
//   styleUrl: './add-leave-type.component.css'
// })
// export class AddLeaveTypeComponent {

// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';

@Component({
  selector: 'app-add-leave-type',
  standalone: false,
  templateUrl: './add-leave-type.component.html',
  styleUrl: './add-leave-type.component.css'
})
export class AddLeaveTypeComponent implements OnInit {

  leaveForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private leaveService: ManageLeaveService
  ) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      leaveName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

onSubmit() {
  if (this.leaveForm.invalid) {
    this.leaveForm.markAllAsTouched();
    return;
  }

  const payload = {
    id: 0,
    leaveName: this.leaveForm.value.leaveName,
    description: this.leaveForm.value.description
  };

  this.isSubmitting = true;

  this.leaveService.insertLeave(payload).subscribe({
    next: (res) => {
      if (res.status === true) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message || 'Leave Added Successfully'
        });

        this.leaveForm.reset();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: res.message
        });
      }

      this.isSubmitting = false;
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Server error'
      });
      this.isSubmitting = false;
    }
  });
}


}
