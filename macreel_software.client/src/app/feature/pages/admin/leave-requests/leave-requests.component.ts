import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ManageLeaveService } from '../../../../core/services/manage-leave.service';
import Swal from 'sweetalert2';
import { CommonService } from '../../../../core/services/common.service';
import { TableColumn } from '../../../../core/models/interface';

@Component({
  selector: 'app-leave-requests',
  standalone: false,
  templateUrl: './leave-requests.component.html',
  styleUrl: './leave-requests.component.css'
})
export class LeaveRequestsComponent {
  displayedColumns: string[] = [
    'srNo',
    'name',
    'leaveName',
    'fromDate',
    'toDate',
    'document',
    'description',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  searchTerm: string = '';
  allLeaves: any[] = [];
  reason : string = '';
  isReasonModal = false;
  pageSizeControl = new FormControl<string>("10")
  searchControl = new FormControl<string>("");
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  leavereq!: TableColumn<any>[];
  isModalOpen = false;
  statusForm!: FormGroup;
   // For document modal
showFilesModal = false;
selectedDocuments: any = [];
// For status modal
showStatusModal = false;
selectedReason: string = '';

  data: any= [];
  @ViewChild('filesTemplate', { static: true }) filesTemplate!: TemplateRef<any>;
    @ViewChild('statustemplate', { static: true }) statustemplate!: TemplateRef<any>;
  constructor(
    private readonly leaveService: ManageLeaveService,
    private readonly fb: FormBuilder,
    private readonly commonservice: CommonService
  ) {
    this.statusForm = this.fb.group({
      id: null,
      reason: ['', [Validators.required]]
    });
  }


  openModal(id: number) {
    const leave = this.allLeaves.find(x => x.id === id);
    if (!leave) return;
    this.statusForm.get('leaveCount')?.setValue(leave.leaveCount);
    this.statusForm.get('id')?.setValue(leave.id);
    this.isModalOpen = true;
  }
  openReasonModal(id:number){
    const leave = this.allLeaves.find(x => x.id === id);
    if (!leave) return;
    this.reason = leave.reason;
    this.isReasonModal = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.isReasonModal = false;
    this.statusForm.reset();
  }

  ApproveLeave(id: number) {
    debugger;
    if (id > 0) {
      this.leaveService.UpdateLeaveStatus(id, 1, null).subscribe({
        next: (res) => {
          if (res.status) {
            Swal.fire({
              title: 'Success',
              text: res.message,
              icon: 'success',
              didClose: () => {
                location.reload();
              }
            });
          } else {
            Swal.fire('Error', res.message, 'error');
          }
        },
        error: (err) => {
          Swal.fire('Error', err.error.errorMessage, 'error');
        }
      })
    }
  }

  onSubmitStatus() {
    if (!this.statusForm.valid) {
      return;
    }
    const formValue = this.statusForm.value;
    //Call Api
    this.leaveService.UpdateLeaveStatus(formValue.id, 2, formValue.reason).subscribe({
      next: (res) => {
        if (res.status) {
          Swal.fire({
            title: 'Success',
            text: res.message,
            icon: 'success',
            didClose: () => {
              this.closeModal();
              location.reload();
            }
          });
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', err.error.errorMessage, 'error');
      }
    });
  }

  ngOnInit(): void {
     
      this.leavereq = [
        { key: 'empName', label: 'Name' ,clickable:true ,route: '/home/admin/employee-details'},
        { key: 'leaveName', label: 'Leave Name'},
        { key: 'fromDate', label: 'From',type :'date' },
        { key: 'toDate', label: 'To', type: 'date', align: 'center' },
        {key: 'fileName',
          label: 'Document',
          type :'custom',
          template: this.filesTemplate },
          
        { key: 'description', label: 'Description' },
        {
          key: 'action',
          label: 'Action',
          template: this.statustemplate
        }
      ];
    this.loadAssignedLeaves();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm = value?.trim() || '';
        this.pageNumber = 1;
        this.loadAssignedLeaves();
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAssignedLeaves();
  }


  loadAssignedLeaves(): void {
    this.leaveService
      .getAllLeaveRequests(this.searchTerm, this.pageNumber, this.pageSize)
      .subscribe({
        next: res => {
          if (res.success) {
            this.allLeaves = res.data;
            this.data = res.data;
            this.totalRecords = res.totalRecords;
          }
        }
      });
  }
  pdfUrl: string =  'https://localhost:7253/'
openFile(filePath: string) {
  console.log("File path:", filePath);
    this.selectedDocuments = Array.isArray(filePath)
    ? filePath.map(doc => `${this.pdfUrl}${doc}`)
    : [`${this.pdfUrl}${filePath}`];

  this.showFilesModal = true;
}

closeFiles() {
  this.showFilesModal = false;
  this.selectedDocuments = [];
}


openReason(reason: string) {
  this.selectedReason = reason;
  this.showStatusModal = true;
}

closeStatusModal() {
  this.showStatusModal = false;
  this.selectedReason = '';
}


}
