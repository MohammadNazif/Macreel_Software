// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-employee',
//   standalone: false,
//   templateUrl: './add-employee.component.html',
//   styleUrl: './add-employee.component.css'
// })
// export class AddEmployeeComponent {

//     step = 1;

//   showTrainingModal = false;
//   showEducationModal = false;

//   nextStep() {
//     this.step = 2;
//   }

//   prevStep() {
//     this.step = 1;
//   }

//   openTrainingModal() {
//     this.showTrainingModal = true;
//   }

//   closeTrainingModal() {
//     this.showTrainingModal = false;
//   }

//   openEducationModal() {
//     this.showEducationModal = true;
//   }

//   closeEducationModal() {
//     this.showEducationModal = false;
//   }

//   onSubmit() {
//     console.log('Employee Form Submitted');
//   }

// }

import { Component } from '@angular/core';
@Component({
  selector: 'app-add-employee',
  standalone: false,
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {

  step = 1;

  showTrainingModal = false;
  showEducationModal = false;

  nextStep() {
    this.step = 2;
  }

  prevStep() {
    this.step = 1;
  }

  openTrainingModal() {
    this.showTrainingModal = true;
  }

  closeTrainingModal() {
    this.showTrainingModal = false;
  }

  openEducationModal() {
    this.showEducationModal = true;
  }

  closeEducationModal() {
    this.showEducationModal = false;
  }
  

  onSubmit() {
    console.log('Employee saved successfully');
  }
}
