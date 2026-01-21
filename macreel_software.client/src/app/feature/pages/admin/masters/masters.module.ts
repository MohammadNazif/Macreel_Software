import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './masters-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { AddTechnologyComponent } from './add-technology/add-technology.component';
import { AddLeaveTypeComponent } from './add-leave-type/add-leave-type.component';
import { AddPageComponent } from './add-page/add-page.component';
import { PageAccessComponent } from './page-access/page-access.component';
import { CommonPagesModule } from "../../../common-pages/common-pages.module";
import { MatChipGrid, MatChipRow, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatOption } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    AddDepartmentComponent,
    AddDesignationComponent,
    AddRoleComponent,
    AddTechnologyComponent,
    AddLeaveTypeComponent,
    AddPageComponent,
    PageAccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MastersRoutingModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonPagesModule,
    MatChipsModule,
    MatChipRow,
    MatChipGrid,
    MatOption,
    MatAutocompleteModule
]
})
export class MastersModule { }
