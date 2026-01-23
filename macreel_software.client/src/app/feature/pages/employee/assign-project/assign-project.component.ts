import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { ProjectService } from '../../../../core/services/project-service.service';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import { Project, TableColumn } from '../../../../core/models/interface';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-assign-project',
  standalone: false,
  templateUrl: './assign-project.component.html',
  styleUrls: ['./assign-project.component.css']
})
export class AssignProjectComponent implements OnInit {

  @ViewChild('filesTemplate', { static: true })
  filesTemplate!: TemplateRef<any>;

  projectsColumns: TableColumn<any>[] = [];
  employeeColumns: TableColumn<any>[] = [];

  projectsData: Project[] = [];
  loading = false;

  showEmployeeListModal = false;
  assignedEmployees: any[] = [];

  showEmployeeModal = false;
  employees: any[] = [];
  selectedEmployees: any[] = [];
  employeeCtrl = new FormControl('');

  selectedProjectId: number | null = null;

  constructor(
    private projectService: ProjectService,
    private manageEmployeeService: ManageEmployeeService
  ) { }

  ngOnInit(): void {
    this.projectsColumns = [
      { key: 'projectName', label: 'Project Name' },
      { key: 'assignDate', label: 'Assign Date', type: 'date' },
      { key: 'completionDate', label: 'Completion Date', type: 'date' },
      { key: 'projectStatus', label: 'Status' },
      {
        key: 'actions',
        label: 'Actions',
        type: 'custom',
        template: this.filesTemplate
      }
    ], [this.employeeColumns = [{ key: 'empName', label: 'Employee Name', width: '150px' },
    { key: 'designation', label: 'Designation', width: '170px' },
    { key: 'category', label: 'Category', width: '170px' }]];

    this.fetchProjects();
  }

  /* =======================
     FETCH ASSIGNED PROJECTS
     ======================= */
  fetchProjects() {
    this.loading = true;
    this.projectService.getAssignedProjectsByEmp().subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res); // 👈 debug
        this.projectsData = res?.success ? res.data : [];
        this.loading = false;
      },
      error: () => {
        this.projectsData = [];
        this.loading = false;
      }
    });
  }


  /* =======================
     OPEN EMPLOYEE MODAL
     ======================= */
  viewEmployee(row: any) {
    this.selectedProjectId = row.id;
    this.showEmployeeModal = true;
    this.loadEmployees();
  }

  /* =======================
     LOAD EMPLOYEES
     ======================= */
  loadEmployees() {
    this.manageEmployeeService.getAllEmployees(1, 50, '').subscribe({
      next: (res: any) => {
        this.employees = res?.success ? res.data : [];
      },
      error: () => {
        this.employees = [];
      }
    });
  }

  /* =======================
     SELECT EMPLOYEE
     ======================= */
  onEmployeeSelected(event: MatAutocompleteSelectedEvent) {
    const empId = event.option.value;
    const emp = this.employees.find(e => e.id === empId);

    if (emp && !this.selectedEmployees.some(e => e.id === empId)) {
      this.selectedEmployees.push(emp);
    }

    this.employeeCtrl.setValue('');
  }

  /* =======================
     REMOVE EMPLOYEE CHIP
     ======================= */
  removeEmployee(emp: any) {
    this.selectedEmployees =
      this.selectedEmployees.filter(e => e.id !== emp.id);
  }

  showAssignedEmployees(row: any) {
    const projectId = row.id;

    this.projectService.getAssignedProjectEmpList(projectId).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.assignedEmployees = res.data;
          this.showEmployeeListModal = true;
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load employees'
        });
      }
    });
  }


  /* =======================
     SUBMIT ASSIGN PROJECT
     ======================= */
  submit() {
    if (!this.selectedProjectId || this.selectedEmployees.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select at least one employee'
      });
      return;
    }

    const payload = {
      projectId: this.selectedProjectId,
      empIds: this.selectedEmployees.map(e => e.id).join(',')
    };

    this.projectService.assignProjectToEmp(payload).subscribe({
      next: (res: any) => {
        if (res?.status) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message || 'Project assigned successfully',
            timer: 2000,
            showConfirmButton: false
          });

          this.closeModal();
          this.fetchProjects();
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong'
        });
      }
    });
  }


  /* =======================
     CLOSE MODAL
     ======================= */
  closeModal() {
    this.showEmployeeModal = false;
    this.selectedEmployees = [];
    this.selectedProjectId = null;
    this.employeeCtrl.reset();
  }
}
