import { Component } from '@angular/core';
import { TableColumn, Task } from '../../../../core/models/interface';

@Component({
  selector: 'app-amc-invoice',
  standalone: false,
  templateUrl: './amc-invoice.component.html',
  styleUrl: './amc-invoice.component.css'
})
export class AmcInvoiceComponent {
 taskColumns: TableColumn<Task>[] = [
    { key: 'title', label: 'Employee Name' },
    { key: 'empName', label: 'PI Number' },
    { key: 'assignedByName', label: 'Company Name' },
    { key: 'completedDate', label: 'AMC Amount'},
 
    { key: 'taskStatus', label: 'Status' },
   
  ];
}
