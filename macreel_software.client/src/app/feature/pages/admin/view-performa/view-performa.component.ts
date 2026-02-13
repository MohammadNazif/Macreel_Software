import { Component } from '@angular/core';
import { TableColumn, Task } from '../../../../core/models/interface';

@Component({
  selector: 'app-view-performa',
  standalone: false,
  templateUrl: './view-performa.component.html',
  styleUrl: './view-performa.component.css'
})
export class ViewPerformaComponent {
 taskColumns: TableColumn<Task>[] = [
    { key: 'title', label: 'Employee Name' },
    { key: 'empName', label: 'PI Number' },
    { key: 'assignedByName', label: 'Company Name' },
    { key: 'completedDate', label: 'Total Amount'},
      { key: 'completedDate', label: 'Invoice Amount'},
        { key: 'completedDate', label: 'Remaining Amount'},
          { key: 'completedDate', label: 'Remaining Amount(%)'},
    { key: 'taskStatus', label: 'Status' },
   
  ];
}
