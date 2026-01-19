import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { AddEmployeeComponent } from '../common-pages/add-employee/add-employee.component';
import { EmployeeProfileComponent } from '../common-pages/employee-profile/employee-profile.component';
import { authGuard } from '../../core/guards/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'employee-registration', component: AddEmployeeComponent },
  {
    path: 'home', component: LayoutComponent,
    canActivate:[authGuard],
    children: [
      { path: '', loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule) },
      { path: 'add-employee', component: AddEmployeeComponent },
      {path:'employee-profile',component: EmployeeProfileComponent},
       {path: 'edit-employee/:id',component: AddEmployeeComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
