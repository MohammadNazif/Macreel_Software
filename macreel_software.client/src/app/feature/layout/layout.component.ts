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
  currentRole: 'admin' | 'employee' = 'admin'; // This should be set based on actual user role


  menus = [
    {
      label: 'Master',
      icon: 'fas fa-id-card',
      key: 'master',
      roles: ['admin'],
      children: [
        {
          label: 'Add Role',
          route: '/home/admin/add-role',roles: ['admin']
        },
        {
          label: 'Add Designation',
          route: '/home/admin/add-designation',roles: ['admin']
        },
        {
          label: 'Add Department',
          route: '/home/admin/add-department',roles: ['admin']
        },
        {
          label: 'Add Technology',
          route: '/home/admin/add-technology',roles: ['admin']
        }
      ]
    },
    {
      label: 'Employee Management',
      icon: 'fa-solid fa-users',
      key: 'employee',
      roles: ['admin'],
      children: [
        {
          label: 'Add Employee',
          route: '/home/add-employee', roles: ['admin']
        },
        {
          label: 'Employee List',
          route: '/home/admin/employee-list', roles: ['admin']
        }
      ]
    },
    {
      label: 'Leave Management',
      icon: 'fas fa-id-card',
      key: 'leave',
      roles: ['admin','employee'],
      children: [
        { label: 'Add Leave', route: '/home/admin/add-leave', roles: ['admin'] },
        { label: 'Assign Leave', route: '/home/admin/assign-leave', roles: ['admin'] },
        { label: 'Apply Leave', route: '/home/employee/apply-leave', roles: ['employee'] },
        { label: 'Assigned Leave', route: '/home/employee/assigned-leaves', roles: ['employee'] }
      ]
    },
    {
      label: 'Attendance Management',
      icon: 'fa-solid fa-calendar-check',
      key: 'attendance',
      roles: ['admin'],
      children: [
        {
          label: 'Upload Attendance',
          route: '/home/admin/upload-attendance',roles: ['admin']
        },
        {
          label: 'View Attendance',
          route: '/home/admin/view-attendance',roles: ['admin']
        }
      ]
    },
    {
      label: 'Task Management',
      icon: 'fa-solid fa-tasks',
      key: 'task',
      roles: ['admin','employee'],
      children: [
        {
          label: 'Add Project Task',
          route: '/home/admin/add-task',
          roles: ['admin']
        },
        {
          label: 'Project Task List',
          route: '/home/admin/task-list',
          roles: ['admin']
        },
        {
          label: 'Employee Task Sheet',
          route: '/home/admin/view-task',
          roles: ['admin']
        },
        {
          label: 'Assigned Tasks',
          route: '/home/admin/view-task',
          roles: ['employee']
        }
      ]
    }

  ];

  get filteredMenus() {
    return this.menus
      .filter(menu => menu.roles.includes(this.currentRole))
      .map(menu => ({
        ...menu,
        children: menu.children?.filter(
          child => !child.roles || child.roles.includes(this.currentRole)
        )
      }));
  }


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
