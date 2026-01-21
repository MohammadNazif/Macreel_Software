import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeeRoutingModule } from './employee-routing.module';
import { CommonPagesModule } from '../../common-pages/common-pages.module';

import { AssignedTaskComponent } from './assigned-task/assigned-task.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignedLeavesComponent } from './assigned-leaves/assigned-leaves.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { AssignProjectComponent } from './assign-project/assign-project.component';
import { A11yModule } from "@angular/cdk/a11y";

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SafeUrlPipe } from '../../../core/pipes/capitalize.pipe';

@NgModule({
  declarations: [
    AssignedTaskComponent,
    DashboardComponent,
    AssignedLeavesComponent,
    ApplyLeaveComponent,
    AssignProjectComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,

    CommonPagesModule,
    SafeUrlPipe
  ],exports:[
    MatPaginatorModule,
    A11yModule
]
})
export class EmployeeModule {}
