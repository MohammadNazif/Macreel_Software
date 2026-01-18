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
      roles: ['57'],
      children: [
        {
          label: 'Add Role',
          route: '/home/admin/master/add-role', roles: ['57']
        },
        {
          label: 'Add Designation',
          route: '/home/admin/master/add-designation', roles: ['57']
        },
        {
          label: 'Add Department',
          route: '/home/admin/master/add-department', roles: ['57']
        },
        {
          label: 'Add Technology',
          route: '/home/admin/master/add-technology', roles: ['57']
        }
      ]
    },
    {
      label: 'Employee Management',
      icon: 'fa-solid fa-users',
      key: '63',
      roles: ['57'],
      children: [
        {
          label: 'Add Employee',
          route: '/home/add-employee', roles: ['57']
        },
        {
          label: 'Employee List',
          route: '/home/admin/employee-list', roles: ['57']
        }
      ]
    },
    {
      label: 'Leave Management',
      icon: 'fas fa-id-card',
      key: 'leave',
      roles: ['57', '63'],
      children: [
        { label: 'Add Leave', route: '/home/admin/add-leave', roles: ['57'] },
        { label: 'Assign Leave', route: '/home/admin/assign-leave', roles: ['57'] },
        { label: 'Apply Leave', route: '/home/employee/apply-leave', roles: ['63'] },
        { label: 'Assigned Leave', route: '/home/employee/assigned-leaves', roles: ['63'] }
      ]
    },
    {
      label: 'Attendance Management',
      icon: 'fa-solid fa-calendar-check',
      key: 'attendance',
      roles: ['57'],
      children: [
        {
          label: 'Upload Attendance',
          route: '/home/admin/upload-attendance', roles: ['57']
        },
        {
          label: 'View Attendance',
          route: '/home/admin/view-attendance', roles: ['57']
        }
      ]
    },
    {
      label: 'Task Management',
      icon: 'fa-solid fa-tasks',
      key: 'task',
      roles: ['57', '63'],
      children: [
        {
          label: 'Add Project Task',
          route: '/home/admin/add-task',
          roles: ['57']
        },
        {
          label: 'Project Task List',
          route: '/home/admin/view-task',
          roles: ['57']
        },
        {
          label: 'Assigned Tasks',
          route: '/home/employee/assigned-tasks',
          roles: ['63']
        }

      ]
    },
    {
      label: 'Project Management',
      icon: 'fa-solid fa-tasks',
      key: 'project',
      roles: ['57', '63'],
      children: [
        {
          label: 'Add Project',
          route: '/home/admin/add-project',
          roles: ['57']
        },
        {
          label: 'View Project',
          route: '/home/admin/view-project',
          roles: ['57']
        },



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
