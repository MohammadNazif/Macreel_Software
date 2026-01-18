import { Component } from '@angular/core';
import { ManageDashboardService } from '../../../../core/services/manage-dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
//  dashboardCount!: EmpDashboardCount;
  isLoading = true;

  constructor(
    private dashboardService: ManageDashboardService
  ) {}

  ngOnInit(): void {
    this.getDashboardCount();
  }

  getDashboardCount(): void {
    this.dashboardService.getEmpDashboardCount().subscribe({
      next: (res) => {
        // this.dashboardCount = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard count error', err);
        this.isLoading = false;
      }
    });
  }
}
