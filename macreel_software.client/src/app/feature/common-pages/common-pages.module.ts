import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPagesRoutingModule } from './common-pages-routing.module';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AddEmployeeComponent,
    EmployeeProfileComponent
  ],
  imports: [
    CommonModule,
    CommonPagesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule
  ]
})
export class CommonPagesModule { }
