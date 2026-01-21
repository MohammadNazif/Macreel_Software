import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ManageMasterdataService } from '../../../../../core/services/manage-masterdata.service';
import Swal from 'sweetalert2';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Page } from '../../../../../core/models/interface';

@Component({
  selector: 'app-page-access',
  standalone: false,
  templateUrl: './page-access.component.html',
  styleUrl: './page-access.component.css'
})
export class PageAccessComponent {
  pageForm!: FormGroup;
  displayedColumns: string[] = ['srNo', 'pageName', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  searchTerm: string = '';
  searchControl = new FormControl<string>("");
  errorRoleMessage: string | null = null;
  errorPageMessage: string | null = null;
  roles: any[] = [];
  allPages: Page[] = [];
  selectedPages: any[] = [];
  pageCtrl = new FormControl('');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  isEditMode = false;
  editId: number | null = null;
  constructor(
    private readonly fb: FormBuilder,
    private readonly master: ManageMasterdataService,
    private readonly announcer: LiveAnnouncer) { }

  get pagesArray(): FormArray {
    return this.pageForm.get('pages') as FormArray;
  }
  createPageGroup(page: any, checked: boolean): FormGroup {
    return this.fb.group({
      pageId: [page.pageId],
      pageName: [page.pageName],
      pageUrl: [page.pageUrl],
      checked: [checked]
    });
  }

  loadPagesByRole(roleId: number) {

    this.master.getPagesByRoleId(roleId).subscribe(res => {

      const assignedPageIds =
        res.data?.[0]?.pages?.map((p: any) => p.pageId) || [];

      this.master.getAllPages().subscribe(all => {

        this.pagesArray.clear(); // 🔥 important

        all.data.forEach((page: any) => {
          const isChecked = assignedPageIds.includes(page.pageId);
          this.pagesArray.push(
            this.createPageGroup(page, isChecked)
          );
        });

        // this.dataSource.data = this.pagesArray.controls;
      });
    });
  }
  ngOnInit(): void {
    this.pageForm = this.fb.group({
      roleId: ['', Validators.required],
      pages: this.fb.array([])
    });
    this.loadPages();
    // Role change → prechecked data
    this.pageForm = this.fb.group({
      roleId: ['', Validators.required],
      pages: this.fb.array([])
    });

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

  onSubmit() {
    if (this.pageForm.invalid) return;

    const selectedPages = this.pagesArray.value
      .filter((p: any) => p.checked)
      .map((p: any) => ({
        pageId: p.pageId
      }));

    const payload = {
      roleId: this.pageForm.value.roleId,
      pageIds: selectedPages
    };

    this.master.assignRolePages(payload).subscribe(res => {
      if (res.success) {
        Swal.fire('Success', res.message, 'success');
      }
    });
  }

  // MUST be called on paginator event
  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPages();
  }
  loadAllPages() {
    this.master.getAllPages().subscribe(res => {
      if (res.success) {
        this.allPages = res.data;
        this.buildPagesForm(this.allPages, []);
      }
    });
  }
  buildPagesForm(allPages: Page[], assignedPages: any[]) {
    this.pagesArray.clear();

    const assignedPageIds = assignedPages.map(p => p.pageId);

    allPages.forEach(page => {
      this.pagesArray.push(
        this.fb.group({
          pageId: [page.id],
          pageName: [page.pageName],
          pageUrl: [page.pageUrl],
          checked: [assignedPageIds.includes(page.id)]
        })
      );
    });

    // this.dataSource.data = this.pagesArray.controls;
  }
  onRoleChange(event: Event) {
    const roleId = 0;
    this.master.getPagesByRoleId(roleId).subscribe(res => {
      if (res.success && res.data.length > 0) {
        const assignedPages = res.data[0].pages; // role wise pages
        this.buildPagesForm(this.allPages, assignedPages);
      } else {
        this.buildPagesForm(this.allPages, []);
      }
    });
  }
  loadPages(): void {
    this.master.getAllPages().subscribe({
      next: res => {
        if (res.success) {
          debugger
          this.dataSource = res.data;
          this.totalRecords = res.totalRecords ?? 0;
          console.log('Total Records', this.dataSource);
        }
      }, error: err => {
        console.error('Error : ', err);
        Swal.fire('Error', err.error.errorMessage, 'error')
      }
    });
    this.master.getRoles().subscribe({
      next: res => {
        if (res.success) {
          this.roles = res.data;
        } else {
          this.errorRoleMessage = "role can not be loaded"
        }
      }
    });
  }
  resetForm(): void {
    this.pageForm.reset();
    this.isEditMode = false;
    this.editId = null;
  }
}
