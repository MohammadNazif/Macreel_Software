import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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


@NgModule({
  declarations: [
    EmployeeTaskSheetComponent,
    AddDepartmentComponent,
    DashboardComponent,
    AddRoleComponent,
    AddDesignationComponent,
    EmployeeListComponent,
    

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
    MatInputModule
  ]
})
export class AdminModule { }
