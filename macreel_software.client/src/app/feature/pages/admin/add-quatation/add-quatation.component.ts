import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
  selector: 'app-add-quatation',
  standalone:false,
  templateUrl: './add-quatation.component.html',
  styleUrls: ['./add-quatation.component.css']
})
export class AddQuatationComponent {

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

addProduct() { this.products.push({ name: '', price: 0, qty: 1, note: '', amc: false, renew: false }); }
removeProduct(i: number) { this.products.splice(i, 1); }
saveCompany() { console.log('Company saved'); }
}
export interface ClientField {
  label: string;
  type: 'text' | 'select';    
  value: string;
  readonly: boolean;
  placeholder?: string;      
  options?: { label: string; value: string }[];  
}

export interface ModalField {
  label: string;
  type: 'text' | 'select' | 'textarea'; 
  value: string;
  placeholder?: string;
  options?: { label: string; value: string }[]; 
}

export interface ModalSection {
  title: string;
  gridCols: string;
  fields: ModalField[];
}