import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactProductListComponent } from './compact-product-list.component';

describe('CompactProductComponent', () => {
  let component: CompactProductListComponent;
  let fixture: ComponentFixture<CompactProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactProductListComponent);
    component = fixture.componentInstance;
    // tslint:disable-next-line:max-line-length
    component.product = {productId : 1, title: 'ProductNr1', type: 1, approved : 1, deliverable: 1, description: 'ProductDescription', images: [ ], location: 'Ort', price: 10.50, priceKind: 100, reviews: [], sellOrLend: 1, status: 1, userId: 1};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
