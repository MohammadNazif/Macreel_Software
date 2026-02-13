import { Component } from '@angular/core';
import { TableColumn, Task } from '../../../../core/models/interface';

@Component({
  selector: 'app-view-quotation',
  standalone: false,
  templateUrl: './view-quotation.component.html',
  styleUrl: './view-quotation.component.css'
})
export class ViewQuotationComponent {

   
  constructor(
  ) { }
   taskColumns: TableColumn<Task>[] = [
    { key: 'title', label: 'Employee Name' },
    { key: 'empName', label: 'Quotataion Number' },
    { key: 'assignedByName', label: 'Company Name' },
    { key: 'assignedDate', label: 'Service Name' },
    { key: 'completedDate', label: 'Total Amount'},
    { key: 'taskStatus', label: 'Status' },
   
  ];
}
