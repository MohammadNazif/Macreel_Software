import { Component } from '@angular/core';
import { ClientField, ModalSection } from '../add-quatation/add-quatation.component';

@Component({
  selector: 'app-tax-invoice',
  standalone: false,
  templateUrl: './tax-invoice.component.html',
  styleUrl: './tax-invoice.component.css'
})
export class TaxInvoiceComponent {
clientFields: ClientField[] = [
  {
    label: 'Select Client',
    type: 'select',  
    placeholder: 'Select Client'   ,          // 'select' is allowed
    options: [{ label: 'ABC', value: 'abc' },{label: 'BCd', value: 'abc'}],
    value: '',
    readonly: false
  },
    {
    label: 'Select Service',
    type: 'select',  
    placeholder: 'Select Service'   ,          // 'select' is allowed
    options: [{ label: 'ABC', value: 'abc' }],
    value: '',
    readonly: false
  },
  {
    label: 'Mobile',
    type: 'text',                 // 'text' is allowed
    placeholder: 'Auto-filled',
    value: '',
    readonly: true
  },
   {
    label: 'Email',
    type: 'text',                 // 'text' is allowed
    placeholder: 'Auto-filled',
    value: '',
    readonly: true
  },
   {
    label: 'Contact Person',
    type: 'text',                 // 'text' is allowed
    placeholder: 'Auto-filled',
    value: '',
    readonly: true
  },
   {
    label: 'GSTN',
    type: 'text',                 // 'text' is allowed
    placeholder: 'Auto-filled',
    value: '',
    readonly: true
  }
];

products = [
  { name: '', price: 0, qty: 1, note: '', amc: false, renew: false }
];

modalSections: ModalSection[] = [
  {
    title: 'Basic Information',
    gridCols: 'md:grid-cols-2 gap-2',
    fields: [
      { label: 'Company Name', type: 'text', placeholder: 'Enter company name', value: '' },
      { label: 'Designation', type: 'text', placeholder: 'Enter your designation', value: '' }
    ]
  },
  {
    title: 'Contact Details',
    gridCols: 'md:grid-cols-2 gap-2',
    fields: [
      { label: 'Contact Person', type: 'text', placeholder: 'Enter contact person', value: '' },
      { label: 'Contact No', type: 'text', placeholder: 'Enter contact number', value: '' },
      { label: 'Email', type: 'text', placeholder: 'Enter email', value: '' }
    ]
  },
  {
    title: 'Tax & Location',
    gridCols: 'md:grid-cols-3 gap-2',
    fields: [
      { label: 'GST No', type: 'text', placeholder: 'GST No', value: '' },
      { label: 'PAN No', type: 'text', placeholder: 'PAN No', value: '' },
      { label: 'State Code', type: 'text', placeholder: 'State Code', value: '' },
      { label: 'State', type: 'select', value: '', options: [
          { label: '-- Select State --', value: '' },
          { label: 'Maharashtra', value: 'MH' },
          { label: 'Karnataka', value: 'KA' },
          { label: 'Delhi', value: 'DL' }
        ] 
      },
      { label: 'City', type: 'select', value: '', options: [
          { label: '-- Select City --', value: '' },
          { label: 'Mumbai', value: 'Mumbai' },
          { label: 'Bengaluru', value: 'Bengaluru' },
          { label: 'New Delhi', value: 'New Delhi' }
        ]
      },
      { label: 'Pincode', type: 'text', placeholder: 'Pincode', value: '' },
      { label: 'Address', type: 'textarea', placeholder: 'Full address', value: '' }
    ]
  }
];

  showCompanyModal = false;

  
  addProduct() {
    this.products.push({ name: '', price: 0, qty: 1, note: '', amc: false, renew: false });
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
  }

  saveCompany() {
    console.log('Company saved');
  }

  /* ---------------- PAYMENT ---------------- */

  paymentMode: 'none' | 'cash' | 'bank' | 'cheque' = 'none';
  dueDate: string = '';

  /* ---------------- TAX ---------------- */

  taxType: '' | 'instate' | 'outstate' = '';
  taxRate = 18;

  /* ---------------- CALCULATIONS ---------------- */

  get subtotal(): number {
    return this.products.reduce((sum, p) => {
      const price = Number(p.price) || 0;
      const qty = Number(p.qty) || 0;
      return sum + (price * qty);
    }, 0);
  }

  // INSTATE → 9% + 9%
  get cgstRate(): number {
    return this.taxType === 'instate' ? this.taxRate / 2 : 0;
  }

  get sgstRate(): number {
    return this.taxType === 'instate' ? this.taxRate / 2 : 0;
  }

  // OUTSTATE → 18%
  get igstRate(): number {
    return this.taxType === 'outstate' ? this.taxRate : 0;
  }

  get cgstAmount(): number {
    return (this.subtotal * this.cgstRate) / 100;
  }

  get sgstAmount(): number {
    return (this.subtotal * this.sgstRate) / 100;
  }

  get igstAmount(): number {
    return (this.subtotal * this.igstRate) / 100;
  }

  get afterTaxAmount(): number {
    if (this.taxType === 'instate') {
      return this.subtotal + this.cgstAmount + this.sgstAmount;
    }

    if (this.taxType === 'outstate') {
      return this.subtotal + this.igstAmount;
    }

    return this.subtotal;
  }

}

