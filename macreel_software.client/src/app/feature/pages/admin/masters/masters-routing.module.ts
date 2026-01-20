import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { AddTechnologyComponent } from './add-technology/add-technology.component';
import { AddLeaveTypeComponent } from './add-leave-type/add-leave-type.component';
import { AddPageComponent } from './add-page/add-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'add-role', pathMatch: 'full' },
  { path: 'add-role', component: AddRoleComponent },
  { path: 'add-designation', component: AddDesignationComponent },
  { path: 'add-department', component: AddDepartmentComponent },
  { path:'add-technology',component:AddTechnologyComponent},
  { path:'add-leave',component:AddLeaveTypeComponent},
  {path:'add-pages',component:AddPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
