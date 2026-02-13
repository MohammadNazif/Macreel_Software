import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuatationComponent } from './add-quatation.component';

describe('AddQuatationComponent', () => {
  let component: AddQuatationComponent;
  let fixture: ComponentFixture<AddQuatationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddQuatationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQuatationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
