import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTaskSheetComponent } from './employee-task-sheet/employee-task-sheet.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddEmployeeComponent } from '../../common-pages/add-employee/add-employee.component';
import { AssignLeaveComponent } from './assign-leave/assign-leave.component';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { ViewAttendanceComponent } from './view-attendance/view-attendance.component';
import { AllEmployeeLeaveListComponent } from './all-employee-leave-list/all-employee-leave-list.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { ViewProjectComponent } from './view-project/view-project.component';




const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'employee-task-sheet', component: EmployeeTaskSheetComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path:'employee-list',component:EmployeeListComponent} ,
  { path: 'edit-employee/:id',component: AddEmployeeComponent},  
  { path:'assign-leave',component:AssignLeaveComponent},
  { path: 'upload-attendance', component: UploadAttendanceComponent },
  { path: 'view-attendance', component: ViewAttendanceComponent },
  { path:'assign-leave',component:AssignLeaveComponent},
  { path:'assigned-employees-leaves',component:AllEmployeeLeaveListComponent},
  {path: 'add-task',component:AddTaskComponent},
  {path: 'view-task',component:ViewTaskComponent},
  {path: 'view-project',component:ViewProjectComponent},
  { path:'add-project',component:AddProjectComponent},
  {path:'master',loadChildren:()=>import('./masters/masters.module').then(n=>n.MastersModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
