import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ManageMasterdataService } from '../../core/services/manage-masterdata.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

  sidebarOpen = true;
  isMobile = false;
  openMenu: string | null = null;
  currentRole: string | '' = ''; // This should be set based on actual user role
  profileOpen = false;
  sidebarMenuList: any;
  allowedPageUrls: string[] = [];
  filteredMenusFromApi: any[] = [];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly master: ManageMasterdataService
  ) { }
  private resizeListener = () => this.checkScreen();

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
        { label: 'Assign Page', route: '/home/admin/master/assign-page', roles: ['admin'] },
        { label: 'Assign Page List', route: '/home/admin/master/assign-page-list', roles: ['admin'] },
      ]
    },
    {
      label: 'Employee Management',
      icon: 'fa-solid fa-users',
      key: 'employee',
      roles: ['admin','hr'],
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
      roles: ['admin', 'employee','hr','reportingManager'],
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
      roles: ['admin','employee','hr','reportingManager'],
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
      roles: ['admin', 'employee','hr','reportingManager'],
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
        },
        {
          label: 'Task List',
          route: '/home/employee/task-list',
          roles: ['employee']
        },
      ]
    },
    {
      label: 'Project Management',
      icon: 'fa-solid fa-tasks',
      key: 'project',
      roles: ['admin','employee','hr','reportingManager'],
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
        },
        {
          label: 'Assigned Projects',
          route: '/home/employee/assign-project',
          roles: ['employee']
        },
        
         {
          label: 'Project Progress',
          route: '/home/admin/project-progress',
          roles: ['admin','employee']
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
    this.currentRole = this.auth.getRole()?.toLocaleLowerCase() as any;
    this.loadData(this.currentRole);
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }
  loadData(role: string) {
    this.master.getAssignPages().subscribe({
      next: res => {
        if (res.success) {
          const data = res.data;

          const roleData = data.find(
            (m: any) => m.roleName.toLowerCase() === role.toLowerCase()
          );

          if (!roleData) return;

          // 1️⃣ extract allowed urls
          this.allowedPageUrls = roleData.pages.map(
            (p: any) => p.pageUrl
          );

          // 2️⃣ filter menus using allowed urls
          this.filteredMenusFromApi = this.menus
            // 1️⃣ role-based parent menu
            .filter(menu => menu.roles.includes(this.currentRole))
            .map(menu => {

              // 2️⃣ role + page based children
              const children = menu.children.filter(child =>
                child.roles.includes(this.currentRole) &&
                this.allowedPageUrls.includes(child.route)
              );

              return { ...menu, children };
            })
            // 3️⃣ remove empty parents
            .filter(menu => menu.children.length > 0);

        }
      },
      error: err => console.error(err)
    });
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
