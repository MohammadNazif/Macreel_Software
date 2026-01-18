import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProjectService } from '../../../../core/services/project-service.service';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Project } from '../../../../core/models/interface';

import { PaginatedList } from '../../../../core/utils/paginated-list';
import { TableColumn } from '../../../../core/models/employee.interface';

@Component({
  selector: 'app-view-project',
  standalone:false,
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {

  searchForm!: FormGroup;
  paginator!: PaginatedList<Project>;

  projectColumns: TableColumn<Project>[] = [
    { key: 'projectTitle', label: 'Project' },
    { key: 'category', label: 'Category' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'completionDate', label: 'Completion Date', type: 'date' },
    { key: 'endDate', label: 'Delivery Date', type: 'date' }
  ];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

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

  edit(p: Project): void {
    console.log('Edit', p.id);
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
