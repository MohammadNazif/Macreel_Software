import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProjectService } from '../../../../core/services/project-service.service';
import { Project, TableColumn } from '../../../../core/models/interface';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';

@Component({
  selector: 'app-assign-project',
  standalone: false,
  templateUrl: './assign-project.component.html',
  styleUrl: './assign-project.component.css'
})

export class AssignProjectComponent implements OnInit {

  @ViewChild('filesTemplate', { static: true }) filesTemplate!: TemplateRef<any>;
  

  projectsColumns: TableColumn<any>[] = [];
  projectsData: Project[] = [];
  loading = false;

showEmployeeModal = false;
employeeLoading = false;

employees: any[] = [];
selectedEmployeeId: number | null = null;
selectedEmployeeName = '';

  constructor(private projectService: ProjectService,
    private manageEmployeeService: ManageEmployeeService
  ) {}

  ngOnInit() {
      this.projectsColumns = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'assignDate', label: 'Assign Date', type: 'date' },
    { key: 'completionDate', label: 'Completion Date', type: 'date' },
    { key: 'projectStatus', label: 'Status' },
     {
        key: 'actions',
        label: 'Actions',
        type: 'custom',
        template: this.filesTemplate   // ✅ now defined
      }
  ];
  this.fetchAssignedProjects();
  }

loadEmployees() {
  this.manageEmployeeService.getAllEmployees(1, 20, '').subscribe({
    next: (res: any) => {
      console.log('Employee API 👉', res);

      if (res?.success && Array.isArray(res.data)) {
        this.employees = res.data;   // ✅ DIRECT ARRAY
      } else {
        this.employees = [];
      }
    },
    error: () => {
      this.employees = [];
    }
  });
}


 fetchAssignedProjects() {
  this.loading = true;
  this.projectService.getAssignedProjectsByEmp().subscribe({
    next: (res: any) => {   // 'any' for now, can create proper interface later
      console.log('Assigned Projects:', res);

      if (res && res.success && res.data) {
        this.projectsData = res.data;  // <-- bind the array
      } else {
        this.projectsData = [];
      }

      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching assigned projects', err);
      this.loading = false;
    }
  });
}

viewEmployee(row: any) {
  console.log('View Employee clicked for project:', row);

  this.showEmployeeModal = true;   // modal open
  this.loadEmployees();            // API call
}

selectEmployee(emp: any) {
  this.selectedEmployeeId = emp.empId;   // ✅ ID set
  this.selectedEmployeeName = emp.empName;

  console.log('Selected Employee ID:', this.selectedEmployeeId);

  this.showEmployeeModal = false; // modal close
}


}
