import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPagesRoutingModule } from './common-pages-routing.module';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddEmployeeComponent
  ],
  imports: [
    CommonModule,
    CommonPagesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CommonPagesModule { }
