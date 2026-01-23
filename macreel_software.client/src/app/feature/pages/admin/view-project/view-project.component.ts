import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Project, TableColumn } from '../../../../core/models/interface';
import { PaginatedList } from '../../../../core/utils/paginated-list';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';

@Component({
  selector: 'app-view-project',
  standalone: false,
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit, AfterViewInit {

  @ViewChild('iconsTemplate', { static: true }) iconsTemplate!: TemplateRef<any>;
  @ViewChild('filesTemplate', { static: true }) filesTemplate!: TemplateRef<any>;

  showEmployeeModal = false;
  selectedEmployees: any[] = [];

  allEmployees: any[] = [];
  employeeTableData: any[] = [];

  showAddEmployeeBox = false;
  employeeSearch = '';
  showEmployeeDropdown = false;
  loadingEmployees = false;

  // Static dummy employees
  employees = [
    { empName: 'John Doe', designation: 'Developer' },
    { empName: 'Jane Smith', designation: 'Tester' },
    { empName: 'Michael Johnson', designation: 'Manager' },
  ];

  searchForm!: FormGroup;
  paginator!: PaginatedList<Project>;
  projectColumns: TableColumn<Project>[] = [];
  employeeColumns!: TableColumn<any>[]; // assign in ngAfterViewInit

  constructor(
    private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly employeeService: ManageEmployeeService,
  ) { }

  ngOnInit(): void {
    // Project table columns
    this.projectColumns = [
      { key: 'projectTitle', label: 'Project', clickable: true, route: '/home/admin/project-details' },
      { key: 'category', label: 'Category' },
      { key: 'startDate', label: 'Start Date', type: 'date', align: 'center' },
      { key: 'endDate', label: 'End Date', type: 'date', align: 'center' },
      { key: 'completionDate', label: 'Completion Date', type: 'date', align: 'center' },
      {
        key: 'appEmpName',
        label: 'App Employee',
        align: 'right',
        type: 'custom',
        template: this.filesTemplate
      },
      {
        key: 'webEmpName',
        label: 'Web Employee',
        align: 'right',
        type: 'custom',
        template: this.filesTemplate
      }
    ];
    this.employeeColumns = [
      { key: 'empName', label: 'Employee Name' },
      { key: 'designation', label: 'Designation' },
      {
        key: 'actions',
        label: 'Actions',
        type: 'custom',
        template: this.iconsTemplate

      }
    ];
    this.searchForm = this.fb.group({ search: [''] });

    this.paginator = new PaginatedList<Project>(
      30,
      (search, page, size) => this.projectService.getProjects(search, page, size)
    );

    this.paginator.load();

    this.searchForm.get('search')!.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(search => {
        this.paginator.reset();
        this.paginator.load(search);
      });
  }

  ngAfterViewInit(): void {
    // Employee table columns (after ViewChild is ready)

  }

  onScroll(event: Event): void {
    this.paginator.handleScroll(event, this.searchForm.value.search);
  }

  openEmployeeModal() {
    this.showEmployeeModal = true;
    this.showEmployeeDropdown = false;
  }


  closeModal() {
    this.showEmployeeModal = false;
    this.selectedEmployees = [];
  }

  toggleAddEmployeeBox() {
    this.showAddEmployeeBox = !this.showAddEmployeeBox;

    if (this.showAddEmployeeBox && this.allEmployees.length === 0) {
      this.fetchEmployees();
    }
  }

 
  onAddEmployeeClick() {
  this.showEmployeeDropdown = !this.showEmployeeDropdown;

  if (this.showEmployeeDropdown && this.allEmployees.length === 0) {
    this.fetchEmployees();
  }
}

fetchEmployees() {
  this.loadingEmployees = true;

  this.employeeService.getAllEmployees(1, 50, '')
    .subscribe(res => {
      if (res.success) {
        this.allEmployees = res.data;
      }
      this.loadingEmployees = false;
    });
}

addChip(emp: any) {
  if (!this.selectedEmployees.some(e => e.id === emp.id)) {
    this.selectedEmployees.push({
      id: emp.id,
      empName: emp.empName,
      designation: emp.designationName,
      status: 1
    });
  }
}

removeChip(emp: any) {
  this.selectedEmployees = this.selectedEmployees.filter(e => e.id !== emp.id);
}

  openEmployeedataModal() {
    this.employeeTableData = [...this.selectedEmployees]; // table stays same
    this.showEmployeeModal = true;
  }



  edit(emp: any) {
    this.router.navigate(['/home/admin/add-project'], { state: { project: emp } });
  }

  Delete(p: Project): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete project "${p.projectTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.projectService.delete(p.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Project has been deleted.', 'success');
            this.paginator.reset();
            this.paginator.load(this.searchForm.value.search);
          },
          error: (err) => {
            Swal.fire('Error', err?.error?.message || 'Failed to delete project', 'error');
          }
        });
      }
    });
  }

  AddEmployee() {

  }
  CancelEmployee() {
  }

  saveEmployees() {
  }
}