import { Component } from '@angular/core';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  standalone: false   // 👈 explicitly non-standalone
})
export class ProjectDetailsComponent {


taskColumns = [
      { key: '', label: 'Employee Name' },
      { key: '', label: 'Milestone' },
      { key: '', label: 'Completion Date' },
      { key: '', label: 'Milestone Delay' },
      { key: '', label: 'Employee Status'},
      { key: '', label: 'Admin Status'},
    ]
  
  project = {
    name: 'LCMIS',
    code: 'MacLCM202015',
    status: 'Working',
    company: 'Irrigation Department',
    client: 'Parul',
    startDate: '2025-10-06',
    completionDate: '2025-10-13',
    deliveryDate: '2025-10-14',
    totalAmount: '0.00',
    employees: ['Himanshu Saxena','Mohammad Nazif','Deep Singh','Himanshu Saxena',
      'Mohammad Nazif','Deep Singh',
    'Himanshu Saxena','Mohammad Nazif','Deep Singh']
  };

  milestones = [
    {
      sno: 1,
      milestone: '',
      completionDate: '',
      employeeStatus: 'Pending',
      delay: '0 Days',
      employeeName: '',
      adminStatus: 'Rejected'
    }
  ];

  employeeStatusLogs: any[] = [];
}
