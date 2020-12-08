import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStatusIconComponent } from './product-status-icon.component';

describe('ProductStatusIconComponent', () => {
  let component: ProductStatusIconComponent;
  let fixture: ComponentFixture<ProductStatusIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStatusIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
