import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ManageMasterdataService } from '../../../../../core/services/manage-masterdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-page-access',
  standalone: false,
  templateUrl: './page-access.component.html',
  styleUrl: './page-access.component.css'
})
export class PageAccessComponent {
  pageForm!: FormGroup;
  displayedColumns: string[] = ['srNo', 'pageName', 'pageUrl', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  searchTerm: string = '';
  searchControl = new FormControl<string>("");

  isEditMode = false;
  editId: number | null = null;
  constructor(
    private readonly fb: FormBuilder,
    private readonly master: ManageMasterdataService) { }

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      pageName: ['', Validators.required],
      pageUrl: ['', Validators.required],
    });
    this.loadPages();
    // Server-side search subscription
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm = value?.trim() || '';
        this.pageNumber = 1; // reset page
        this.loadPages();
      });
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
            this.loadPages();
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
            this.loadPages();
          })
        }
      }
    });
  }
  // MUST be called on paginator event
  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPages();
  }

  loadPages(): void {
    this.master.getAllPages(this.pageNumber, this.pageSize).subscribe({
      next: res => {
        if (res.success) {
          this.dataSource.data = res.data;
          this.totalRecords = res.totalRecords ?? 0;
          console.log('Total Records', this.totalRecords);
        }
      }, error: err => {
        console.error('Error : ', err);
        Swal.fire('Error', err.error.errorMessage, 'error')
      }
    });
  }
  resetForm(): void {
    this.pageForm.reset();
    this.isEditMode = false;
    this.editId = null;
  }
}
