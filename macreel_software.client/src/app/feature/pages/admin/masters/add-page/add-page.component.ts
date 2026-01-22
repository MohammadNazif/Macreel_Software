import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ManageMasterdataService } from '../../../../../core/services/manage-masterdata.service';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Project, TableColumn } from '../../../../../core/models/interface';
import { PaginatedList } from '../../../../../core/utils/paginated-list';

@Component({
  selector: 'app-add-page',
  standalone: false,
  templateUrl: './add-page.component.html',
  styleUrl: './add-page.component.css'
})
export class AddPageComponent implements OnInit {
  pageForm!: FormGroup;
  searchForm!: FormGroup;
  paginator!: PaginatedList<Project>;
  data: any = []
  isEditMode = false;
  editId: number | null = null;
  constructor(
    private readonly fb: FormBuilder,
    private readonly master: ManageMasterdataService) { }

  Page: TableColumn<any>[] = [
    { key: 'pageName', label: 'Name' },
    { key: 'pageUrl', label: 'Url' }
  ];
  ngOnInit(): void {
    this.pageForm = this.fb.group({
      pageName: ['', Validators.required],
      pageUrl: ['', Validators.required],
    });
    this.paginator = new PaginatedList<Project>(
      30,
      (search, page, size) => this.loadPages(search, page, size)
    );

    this.paginator.load();
    // Server-side search subscription
    this.searchForm.get('search')!
      .valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(search => {
        debugger;
        this.paginator.reset();
        this.paginator.load(search);
      });
  }
  onScroll(event: Event): void {
    this.paginator.handleScroll(event, this.searchForm.value.search);
  }

  onSubmit(): void {
    if (this.pageForm.invalid) return;

    const payload = {
      id: this.editId ?? 0,
      pageName: this.pageForm.value.pageName.trim(),
      pageUrl: this.pageForm.value.pageUrl.trim()
    };

    this.master.insertPage(payload).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire('Success', res.message, 'success').then(() => {
            this.resetForm();
            this.paginator.load();
          });
        } else {
          Swal.fire('Success', res.message, 'success');
        }
      }, error: err => {
        Swal.fire('Error', err.error.errorMessage, 'error')
      }
    });
  }

  editPage(row: any): void {
    this.isEditMode = true;
    this.editId = row.id;

    this.pageForm.patchValue({
      pageName: row.pageName,
      pageUrl: row.pageUrl
    });
  }

  deletePage(row: any): void {
    if (!row?.id) return;

    this.master.deletePageById(row.id).subscribe({
      next: res => {
        if (res.status) {
          Swal.fire('Success', res.message, 'success').then(() => {
            this.paginator.load();
          })
        }
      }
    });
  }

  loadPages(searchTerm: string, pageNumber: number, pageSize: number) {
    return this.master.getAllPages(pageNumber, pageSize, searchTerm).pipe(
      map(res => {
        if (res.success) {
          this.data = res.data;
        }else{
          return res
        }
      })
    );
  }
  resetForm(): void {
    this.pageForm.reset();
    this.isEditMode = false;
    this.editId = null;
  }
}
