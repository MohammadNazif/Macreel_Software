import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ManageMasterdataService } from '../../../../../core/services/manage-masterdata.service';
import Swal from 'sweetalert2';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Page, PageRow, TableColumn } from '../../../../../core/models/interface';

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
  pageRows: PageRow[] = [];

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
    debugger
    this.master.getPagesByRoleId(roleId).subscribe(res => {

      const assignedPageIds =
        res.data?.[0]?.pages?.map((p: any) => p.pageId) || [];

      this.master.getAllPages().subscribe(all => {

        this.pagesArray.clear();

        all.data.forEach((page: any) => {
          this.pagesArray.push(
            this.fb.group({
              pageId: [page.id],
              pageName: [page.pageName],
              pageUrl: [page.pageUrl],
              checked: [assignedPageIds.includes(page.id)]
            })
          );
        });

        this.dataSource.data = this.pagesArray.value;
      });
    });
  }

  Pages: TableColumn<Page>[] = [
    { key: 'pageName', label: 'Page Name' },
    { key: 'checked', label: 'Allow Access', type: 'checkbox' }
  ];

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      roleId: ['', Validators.required],
      pages: this.fb.array([])
    });

    this.loadAllPages();
    this.loadRoles();
  }
  getCheckbox(event: { row: PageRow; key: string; value: boolean }) {
    event.row.checked = event.value;
  }

  onSubmit() {
    if (this.pageForm.invalid) return;

    const pages = this.pageRows
      .filter(p => p.checked)
      .map(p => ({ pageId: p.pageId }));

    if (pages.length === 0) {
      Swal.fire('Warning', 'Please select at least one page', 'warning');
      return;
    }

    const payload = {
      roleId: this.pageForm.value.roleId,
      pages
    };

    this.master.assignRolePages(payload).subscribe(res => {
      if (res.success) {
        Swal.fire('Success', res.message, 'success').then(()=>{
          location.reload();
        })
      }
    });
  }
  loadRoles() {
    this.master.getRoles().subscribe({
      next: res => {
        if (res.success) {
          this.roles = res.data;
        }
      }
    })
  }
  loadAllPages() {
    this.master.getAllPages().subscribe(res => {
      if (res.success) {
        this.pageRows = res.data.map((p: any) => ({
          pageId: p.id,
          pageName: p.pageName,
          pageUrl: p.pageUrl,
          checked: false
        }));

        this.dataSource.data = this.pageRows;
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

    this.dataSource.data = this.pagesArray.controls;
  }
  onRoleChange(event: Event) {
    const roleId = Number((event.target as HTMLSelectElement).value);
    if (!roleId) return;

    this.master.getPagesByRoleId(roleId).subscribe(res => {

      const assignedPageIds =
        res.data?.[0]?.pages?.map((p: any) => p.pageId) || [];

      this.pageRows.forEach(row => {
        row.checked = assignedPageIds.includes(row.pageId);
      });

      // refresh table
      this.dataSource.data = [...this.pageRows];
    });
  }

  loadPages(): void {
    this.master.getAllPages().subscribe({
      next: res => {
        if (res.success) {
          this.dataSource.data = res.data;
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
