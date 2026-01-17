import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedLeavesComponent } from './assigned-leaves.component';

describe('AssignedLeavesComponent', () => {
  let component: AssignedLeavesComponent;
  let fixture: ComponentFixture<AssignedLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedLeavesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
