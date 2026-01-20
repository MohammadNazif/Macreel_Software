import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
  {path:'',redirectTo:'add-employee',pathMatch:'full'},
  { path: 'add-employee', component: AddEmployeeComponent },
  {path:'employee-profile',component:EmployeeProfileComponent},
  {path: 'edit-employee/:id',component: AddEmployeeComponent},
  {path: 'project-details',component:ProjectDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonPagesRoutingModule { 
  
}
