import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPerformaComponent } from './view-performa.component';

describe('ViewPerformaComponent', () => {
  let component: ViewPerformaComponent;
  let fixture: ComponentFixture<ViewPerformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPerformaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPerformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
