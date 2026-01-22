import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPageListComponent } from './assign-page-list.component';

describe('AssignPageListComponent', () => {
  let component: AssignPageListComponent;
  let fixture: ComponentFixture<AssignPageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignPageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
