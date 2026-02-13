import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcInvoiceComponent } from './amc-invoice.component';

describe('AmcInvoiceComponent', () => {
  let component: AmcInvoiceComponent;
  let fixture: ComponentFixture<AmcInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmcInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmcInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
