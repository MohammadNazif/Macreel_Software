import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Project } from '../../../../core/models/interface';

@Component({
  selector: 'app-view-project',
  standalone: false,
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {

  projects: Project[] = [];
  searchForm!: FormGroup;

  tableLoading = false;   // ✅ only ONE loader
  pageNumber = 1;
  pageSize = 30;
  totalPages = 0;
  hasMore = true;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {

    this.searchForm = this.fb.group({
      search: ['']
    });

    this.loadProjects();

    // ✅ Debounced search
    this.searchForm.get('search')!
      .valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => this.resetAndLoad());
  }
loadProjects(): void {
  if (this.tableLoading || !this.hasMore) return;

  this.tableLoading = true;

  this.projectService.getProjects(
    this.searchForm.value.search,
    this.pageNumber,
    this.pageSize
  ).subscribe({
    next: (res) => {
      this.projects.push(...res.data);
      this.totalPages = res.totalPages;
      if (this.pageNumber >= this.totalPages) this.hasMore = false;
      this.pageNumber++;
      this.tableLoading = false; // ✅ hide loader
    },
    error: () => {
      this.tableLoading = false; // ✅ hide loader on error
    }
  });
}

  resetAndLoad(): void {
    this.projects = [];
    this.pageNumber = 1;
    this.totalPages = 0;
    this.hasMore = true;
    this.loadProjects();
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;

    // ✅ more stable threshold
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
      this.loadProjects();
    }
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
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.projectService.delete(p.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Project has been deleted.', 'success');
            this.resetAndLoad();   // ✅ IMPORTANT FIX
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
