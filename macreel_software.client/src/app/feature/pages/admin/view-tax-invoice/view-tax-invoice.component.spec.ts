import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaxInvoiceComponent } from './view-tax-invoice.component';

describe('ViewTaxInvoiceComponent', () => {
  let component: ViewTaxInvoiceComponent;
  let fixture: ComponentFixture<ViewTaxInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewTaxInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTaxInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
