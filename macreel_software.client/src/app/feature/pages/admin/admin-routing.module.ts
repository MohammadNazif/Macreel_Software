import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTaskSheetComponent } from './employee-task-sheet/employee-task-sheet.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddEmployeeComponent } from '../../common-pages/add-employee/add-employee.component';
import { AddLeaveTypeComponent } from './add-leave-type/add-leave-type.component';
import { AddTechnologyComponent } from './add-technology/add-technology.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'employee-task-sheet', component: EmployeeTaskSheetComponent },
  { path: 'add-role', component: AddRoleComponent },
  { path:'add-designation',component:AddDesignationComponent},
  { path: 'add-department', component: AddDepartmentComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path:'employee-list',component:EmployeeListComponent} ,
  { path: 'edit-employee/:id',component: AddEmployeeComponent},
  { path:'add-leave',component:AddLeaveTypeComponent},
  { path:'add-technology',component:AddTechnologyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
