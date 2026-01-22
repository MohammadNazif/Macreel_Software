import { Component, OnInit } from '@angular/core';
import { TableColumn, Project } from '../../../../../core/models/interface';
import { ManageMasterdataService } from '../../../../../core/services/manage-masterdata.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { PaginatedList } from '../../../../../core/utils/paginated-list';

@Component({
  selector: 'app-assign-page-list',
  standalone: false,
  templateUrl: './assign-page-list.component.html',
  styleUrl: './assign-page-list.component.css'
})
export class AssignPageListComponent implements OnInit {
  columnsName!: TableColumn<any>[];
  tableData!: any;
  searchForm!: FormGroup;
  paginator!: PaginatedList<Project>;
  constructor(
    private readonly master: ManageMasterdataService,
    private readonly fb:FormBuilder
  ) { }
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });
    this.columnsName = [
      { key: 'roleName', label: 'Role' },
      { key: 'pageName', label: 'Allow Pages' }
    ];

    this.paginator = new PaginatedList<Project>(
      30,
      (search, page, size) => this.loadData(search, page, size)
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

  loadData(searchTerm: string, pageNumber: number, pageSize: number) {
    return this.master.getAssignPages(searchTerm, pageNumber, pageSize).pipe(
      map(res => {
        if (res.success) {
          const data = res.data.map((role: any) => ({
            roleName: role.roleName,
            pageName: role.pages.map((p: any) => p.pageName).join(', ')
          }));
          this.tableData = data;
          return res;
        } else {
          console.log(res.message);
          return res;
        }
      })
    );
  }
}
