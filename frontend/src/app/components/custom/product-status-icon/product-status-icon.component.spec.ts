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
    // tslint:disable-next-line:max-line-length
    component.product = {productId : 1, title: 'ProductNr1', type: 1, approved : 1, deliverable: 1, description: 'ProductDescription', images: [ ], location: 'Ort', price: 10.50, priceKind: 100, reviews: [], sellOrLend: 1, status: 1, userId: 1};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
