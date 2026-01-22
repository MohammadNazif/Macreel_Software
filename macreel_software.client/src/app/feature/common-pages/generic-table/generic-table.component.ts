import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

import { DatePipe } from '@angular/common';
import { TableColumn } from '../../../core/models/interface';
import { Router } from '@angular/router';

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
  @Input() showActions = true;


  @Output() cellAction = new EventEmitter<{ action: string, row: any }>();
  @Input() router!: Router;

  @Output() checkboxChange = new EventEmitter<{ row: any; key: string; value: boolean }>();
  @Output() numberChange = new EventEmitter<{ row: any; key: string; value: number }>();

  constructor(private datePipe: DatePipe,
    private Router : Router
  ) {}

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

onCellClick(row: any, col: TableColumn<any>) {

  if (col.apiActions?.length) {
    col.apiActions.forEach(action => this.cellAction.emit({ action, row }));
  }

    if (col.route) {
      this.Router.navigate([col.route], { queryParams: row  });
    }
}
onCheckboxChange(item: any, key: any, event: Event) {
  const input = event.target as HTMLInputElement | null;


  if (!input) return;
  const checked = input.checked;
    console.log("das",input.checked)
  item[key] = checked;

  this.checkboxChange.emit({ row: item, key, value: checked });
}

onNumberChange(item: any, key: any, event: Event) {
  const input = event.target as HTMLInputElement | null;
  if (!input) return;
  const value = Number(input.value);
  item[key] = value;

  this.numberChange.emit({ row: item, key, value });
}

}
