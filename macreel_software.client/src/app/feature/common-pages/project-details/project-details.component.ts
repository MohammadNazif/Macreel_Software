import { Component } from '@angular/core';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  standalone: false   // 👈 explicitly non-standalone
})
export class ProjectDetailsComponent {

  project: any;

  webTL: string | null = null;
  webMembers: string[] = [];

  appTL: string | null = null;
  appMembers: string[] = [];

  ngOnInit(): void {
    this.project = history.state?.employee;
    this.prepareEmployees();
  }

  prepareEmployees() {

    if (!this.project) return;

    // WEB
    this.webTL = this.project.webEmpName || null;
    this.webMembers = this.project.webProjectMembers?.map(
      (e: any) => e.empName
    ) || [];

    // APP
    this.appTL = this.project.appEmpName || null;
    this.appMembers = this.project.appProjectMembers?.map(
      (e: any) => e.empName
    ) || [];
  }
}

