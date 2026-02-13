import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuatationandpicommonComponent } from './quatationandpicommon.component';

describe('QuatationandpicommonComponent', () => {
  let component: QuatationandpicommonComponent;
  let fixture: ComponentFixture<QuatationandpicommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuatationandpicommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuatationandpicommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
