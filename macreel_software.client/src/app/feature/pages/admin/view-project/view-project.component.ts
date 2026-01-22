import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Project, TableColumn } from '../../../../core/models/interface';
import { PaginatedList } from '../../../../core/utils/paginated-list';


@Component({
  selector: 'app-view-project',
  standalone: false,
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {

  searchForm!: FormGroup;
  paginator!: PaginatedList<Project>;

  projectColumns: TableColumn<Project>[] = [
    { key: 'projectTitle', label: 'Project', clickable: true, route: '/home/admin/project-details' },
    { key: 'category', label: 'Category' },
    { key: 'startDate', label: 'Start Date', type: 'date', align: 'center' },
    { key: 'completionDate', label: 'Completion Date', type: 'date', align: 'center' },
    { key: 'endDate', label: 'Delivery Date', type: 'date', align: 'center' },
    { key: 'appEmpName', label: 'App Employee' },
    { key: 'webEmpName', label: 'Web Employee' },
    { key: 'delayedDays', label: 'Delay', align: 'center' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly router: Router

  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.paginator = new PaginatedList<Project>(
      30,
      (search, page, size) => this.projectService.getProjects(search, page, size)
    );

    this.paginator.load();

    this.searchForm.get('search')!
      .valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(search => {
        this.paginator.reset();
        this.paginator.load(search);
      });
  }

  onScroll(event: Event): void {
    this.paginator.handleScroll(event, this.searchForm.value.search);
  }

  edit(emp: any) {
    this.router.navigate(
      ['/home/admin/add-project'],
      {
        state: { project: emp }
      }
    );
  }

  Delete(p: Project): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete project "${p.projectTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.projectService.delete(p.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Project has been deleted.', 'success');
            this.paginator.reset();
            this.paginator.load(this.searchForm.value.search);
          },
          error: (err) => {
            Swal.fire(
              'Error',
              err?.error?.message || 'Failed to delete project',
              'error'
            );
          }
        });
      }
    });
  }
}
