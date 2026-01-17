import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeLeaveListComponent } from './all-employee-leave-list.component';

describe('AllEmployeeLeaveListComponent', () => {
  let component: AllEmployeeLeaveListComponent;
  let fixture: ComponentFixture<AllEmployeeLeaveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllEmployeeLeaveListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEmployeeLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
