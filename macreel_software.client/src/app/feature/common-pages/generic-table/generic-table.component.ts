import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

import { DatePipe } from '@angular/common';
import { TableColumn } from '../../../core/models/interface';

@Component({
  selector: 'app-generic-table',
  standalone:false,
  templateUrl: './generic-table.component.html',
  providers: [DatePipe]   // ✅ DatePipe provider
})
export class GenericTableComponent<T> {

  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  @Output() tableScroll = new EventEmitter<Event>();


  constructor(private datePipe: DatePipe) {}

  private isDate(value: any): boolean {
    return value instanceof Date || !isNaN(Date.parse(value));
  }

  formatCell(item: T, col: TableColumn<T>) {
    const value = item[col.key];

    if (col.type === 'date') {
      // 🔥 IMPORTANT: Cast to any to satisfy DatePipe typing
      return this.datePipe.transform(value as any, 'dd MMM yyyy');
    }

    return value as any;
  }

    onScroll(event: Event) {
    this.tableScroll.emit(event);
  }
}
