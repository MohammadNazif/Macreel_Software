import { Component } from '@angular/core';
import { ManageDashboardService } from '../../../../core/services/manage-dashboard.service';
import { AdminDashboard, EmpDashboardCount } from '../../../../core/models/interface';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  isLoading = true;

  constructor(
    private dashboardService: ManageDashboardService
  ) {}
 ngOnInit(): void {
    this.getAdminDashboardCount();
  }
dashboardCount: AdminDashboard = {
  totalProjects: 0,
  ongoingProjects: 0,
  totalEmployees: 0,
  absentEmployee: 0,
  totalTasks: 0,
  completedTask: 0,
  leaveRequest: 0,
  upcomingLeaves: 0
};

getAdminDashboardCount(): void {
  this.dashboardService.getAdminDashboardCount().subscribe({
    next: (res) => {
      this.dashboardCount = res.data[0]; 
      console.log('Admin dash count', this.dashboardCount);
      this.isLoading = false;
    },
    error: () => this.isLoading = false
  });
}
}




  
  

