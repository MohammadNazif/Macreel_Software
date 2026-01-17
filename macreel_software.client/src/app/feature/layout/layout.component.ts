import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  sidebarOpen = true;
  isMobile = false;
  openMenu: string | null = null;


  menus = [
 {
  label: 'Master',
  icon: 'fas fa-id-card',
  key: 'master',
  children: [
    {
      label: 'Add Role',
      route: '/home/add-role'
    },
    {
      label: 'Add Designation',
      route: '/home/add-designation'
    },
    {
      label: 'Add Department',
      route: '/home/add-department'
    },
    {
      label: 'Add Technology',
      route: '/home/add-technology'
    }
  ]
},
  {
    label: 'Employee Management',
    icon: 'fa-solid fa-users',
    key: 'employee',
    children: [
      {
        label: 'Add Employee',
        route: '/home/add-employee'
      },
      {
        label: 'Employee List',
        route: '/home/employee-list'
      }
    ]
  },
    {
    label: 'Leave Management',
    icon: 'fas fa-id-card',
    key: 'leave',
    children: [
      { label: 'Add Leave', route: '/home/add-leave' },
      { label: 'Assign Leave', route: '/home/assign-leave' },
      { label: 'All Employee Leave', route: '/home/AllEmployeeLeave' }

    ]
  },

  {
    label: 'Attendance Management',
    icon: 'fa-solid fa-calendar-check',
    key: 'attendance',
    children: [
      {
        label: 'Upload Attendance',
        route: '/home/upload-attendance'
      },
      {
        label: 'View Attendance',
        route: '/home/view-attendance'
      }
    ]
  },

];


  
  ngOnInit(): void {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  closeSidebarOnMobile() {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }
}
