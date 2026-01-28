import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { AdminRoutingModule } from './admin-routing.module';
import { EmployeeTaskSheetComponent } from './employee-task-sheet/employee-task-sheet.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AssignLeaveComponent } from './assign-leave/assign-leave.component';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { ViewAttendanceComponent } from './view-attendance/view-attendance.component';
import { AllEmployeeLeaveListComponent } from './all-employee-leave-list/all-employee-leave-list.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { CommonPagesModule } from '../../common-pages/common-pages.module';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';
import { SafeUrlPipe } from "../../../core/pipes/capitalize.pipe";
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    EmployeeTaskSheetComponent,
    DashboardComponent,
    EmployeeListComponent,
    AssignLeaveComponent,
    UploadAttendanceComponent,
    ViewAttendanceComponent,
    AllEmployeeLeaveListComponent,
    AddProjectComponent,
    AddTaskComponent,
    ViewTaskComponent,
    ViewProjectComponent,
    LeaveRequestsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonPagesModule,
    SafeUrlPipe
  ],

  providers: [
    DatePipe
  ]
})
export class AdminModule { }
