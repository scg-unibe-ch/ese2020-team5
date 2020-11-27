import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveProductComponent } from './approve-product.component';

describe('ApproveProductComponent', () => {
  let component: ApproveProductComponent;
  let fixture: ComponentFixture<ApproveProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
