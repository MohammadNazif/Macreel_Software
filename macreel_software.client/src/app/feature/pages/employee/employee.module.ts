import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { AssignedTaskComponent } from './assigned-task/assigned-task.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignedLeavesComponent } from './assigned-leaves/assigned-leaves.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    AssignedTaskComponent,
    DashboardComponent,
    AssignedLeavesComponent,
    ApplyLeaveComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginator,
    MatPaginatorModule
  ]
})
export class EmployeeModule { }
