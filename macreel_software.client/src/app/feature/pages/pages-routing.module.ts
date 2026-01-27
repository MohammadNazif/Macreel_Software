import { roleGuard } from './../../core/guards/guards/role.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/guards/auth.guard';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate:[authGuard,roleGuard],
    data:{roles:["admin",'manager']}
  },
  {path:'employee',loadChildren:()=>import('./employee/employee.module').then(m => m.EmployeeModule),
    canActivate:[authGuard,roleGuard],
    data:{roles:["employee"]}
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
