// quatationandpicommon.component.ts
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';


interface ClientField {
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  readonly?: boolean;
  options?: { label: string; value: any }[];
  value?: any;
}

interface Product {
  name: string;
  price: number;
  qty: number;
  note?: string;
  amc?: boolean;
  renew?: boolean;
}

interface ModalField {
  label: string;
  type: 'text' | 'select' | 'textarea';
  placeholder?: string;
  options?: { label: string; value: any }[];
  value?: any;
}

interface ModalSection {
  title: string;
  gridCols?: string;
  fields: ModalField[];
}

@Component({
  selector: 'app-quatationandpicommon',
  standalone:false,
  templateUrl: './quatationandpicommon.component.html',
  styleUrls: ['./quatationandpicommon.component.css']
})
export class QuatationAndPiCommonComponent {
  @Input() clientFields: ClientField[] = [];
  @Input() products: Product[] = [];
  @Input() modalSections: ModalSection[] = [];
  @Input() showCompanyModal = false;

  /** Outputs */
  @Output() addProductEvent = new EventEmitter<void>();
  @Output() removeProductEvent = new EventEmitter<number>();
  @Output() saveCompanyEvent = new EventEmitter<void>();

  /** Methods */
  addProduct() { this.addProductEvent.emit(); }
  removeProduct(i: number) { this.removeProductEvent.emit(i); }
  saveCompany() { this.saveCompanyEvent.emit(); }

  /** Calculate row total */
  rowTotal(product: Product): number {
    return (product.price || 0) * (product.qty || 0);
  }

  /** Calculate summary totals */
  get totalItems(): number {
    return this.products.length;
  }

  get totalQty(): number {
    return this.products.reduce((sum, p) => sum + (p.qty || 0), 0);
  }

  get subtotal(): number {
    return this.products.reduce((sum, p) => sum + this.rowTotal(p), 0);
  }

  get gst(): number {
    return this.subtotal * 0.18; // assuming 18% GST
  }

  get grandTotal(): number {
    return this.subtotal + this.gst;
  }
}
