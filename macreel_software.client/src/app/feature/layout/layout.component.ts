import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

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
  currentRole: string | '' = ''; // This should be set based on actual user role
  profileOpen = false;


  constructor(
    private readonly auth: AuthService,
    private readonly router : Router
  ) { }

  menus = [
    {
      label: 'Master',
      icon: 'fas fa-id-card',
      key: 'master',
      roles: ['admin'],
      children: [
        {
          label: 'Add Role',
          route: '/home/admin/master/add-role', roles: ['admin']
        },
        {
          label: 'Add Designation',
          route: '/home/admin/master/add-designation', roles: ['admin']
        },
        {
          label: 'Add Department',
          route: '/home/admin/master/add-department', roles: ['admin']
        },
        {
          label: 'Add Technology',
          route: '/home/admin/master/add-technology', roles: ['admin']
        },
        { label: 'Add Leave', route: '/home/admin/master/add-leave', roles: ['admin'] },
        { label: 'Add Page', route: '/home/admin/master/add-pages', roles: ['admin'] },
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
      roles: ['admin', 'employee'],
      children: [
        { label: 'Assign Leave', route: '/home/admin/assign-leave', roles: ['admin'] },
        { label: 'Assigned Leaves', route: '/home/admin/assigned-employees-leaves', roles: ['admin'] },
        { label: 'Leave Request', route: '/home/admin/leave-requests', roles: ['admin'] },
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
          route: '/home/admin/upload-attendance', roles: ['admin']
        },
        {
          label: 'View Attendance',
          route: '/home/admin/view-attendance', roles: ['admin']
        }
      ]
    },
    {
      label: 'Task Management',
      icon: 'fa-solid fa-tasks',
      key: 'task',
      roles: ['admin', 'employee'],
      children: [
        {
          label: 'Add Task',
          route: '/home/admin/add-task',
          roles: ['admin']
        },
        {
          label: 'Task List',
          route: '/home/admin/view-task',
          roles: ['admin']
        },
        {
          label: 'Assigned Tasks',
          route: '/home/employee/assigned-tasks',
          roles: ['employee']
        }
      ]
    },
    {
      label: 'Project Management',
      icon: 'fa-solid fa-tasks',
      key: 'project',
      roles: ['admin'],
      children: [
        {
          label: 'Add Project',
          route: '/home/admin/add-project',
          roles: ['admin']
        },
        {
          label: 'View Project',
          route: '/home/admin/view-project',
          roles: ['admin']
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
    this.currentRole = this.auth.getRole() as any;
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

  toggleProfileMenu() {
    this.profileOpen = !this.profileOpen;
  }

  goToChangePassword() {
    this.profileOpen = false;
    this.router.navigate(['/home/change-password']);
  }

  logout() {
    this.profileOpen = false;

    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
