import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

import { AdminRoutingModule } from './admin-routing.module';
import { EmployeeTaskSheetComponent } from './employee-task-sheet/employee-task-sheet.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddLeaveTypeComponent } from './add-leave-type/add-leave-type.component';
import { AddTechnologyComponent } from './add-technology/add-technology.component';


@NgModule({
  declarations: [
    EmployeeTaskSheetComponent,
    AddDepartmentComponent,
    DashboardComponent,
    AddRoleComponent,
    AddDesignationComponent,
    EmployeeListComponent,
    AddLeaveTypeComponent,
    AddTechnologyComponent,
    

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
    ReactiveFormsModule
  ]
})
export class AdminModule { }
