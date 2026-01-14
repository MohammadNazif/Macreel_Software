import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';

const routes: Routes = [
  {path:'',redirectTo:'add-employee',pathMatch:'full'},
  { path: 'add-employee', component: AddEmployeeComponent },
  {path:'employee-profile',component:EmployeeProfileComponent},
  {path: 'edit-employee/:id',component: AddEmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonPagesRoutingModule { }
