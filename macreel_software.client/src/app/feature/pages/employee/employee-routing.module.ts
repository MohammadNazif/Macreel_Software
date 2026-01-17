import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignedTaskComponent } from './assigned-task/assigned-task.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { AssignedLeavesComponent } from './assigned-leaves/assigned-leaves.component';

const routes: Routes = [
  {path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'dashboard',component:DashboardComponent},
  {path:'assigned-tasks',component:AssignedTaskComponent},
  {path:'assigned-leaves',component:AssignedLeavesComponent},
  {path:'apply-leave',component:ApplyLeaveComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
