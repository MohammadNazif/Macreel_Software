import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeeRoutingModule } from './employee-routing.module';
import { CommonPagesModule } from '../../common-pages/common-pages.module';

import { AssignedTaskComponent } from './assigned-task/assigned-task.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignedLeavesComponent } from './assigned-leaves/assigned-leaves.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { AssignProjectComponent } from './assign-project/assign-project.component';
import { CommonPagesModule } from "../../common-pages/common-pages.module";

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SafeUrlPipe } from '../../../core/pipes/capitalize.pipe';

@NgModule({
  declarations: [
    AssignedTaskComponent,
    DashboardComponent,
    AssignedLeavesComponent,
    ApplyLeaveComponent,
    AssignProjectComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatTableModule,
<<<<<<< HEAD
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,

    CommonPagesModule,
    SafeUrlPipe
  ]
=======
    MatPaginator,
    MatPaginatorModule,
    CommonPagesModule
]
>>>>>>> d46015d300249b638049e73f6b113cb8012c417a
})
export class EmployeeModule {}
