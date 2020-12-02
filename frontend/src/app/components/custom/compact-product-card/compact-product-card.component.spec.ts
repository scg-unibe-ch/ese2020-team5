import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompactProductCardComponent } from './compact-product-card.component';
import {ProductService} from '../../../services/product.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CompactProductCardComponent', () => {
  let component: CompactProductCardComponent;
  let fixture: ComponentFixture<CompactProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactProductCardComponent ],
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactProductCardComponent);
    component = fixture.componentInstance;
    component.product = {productId : 1, title: 'ProductNr1', type: 1, approved : 1, deliverable: 1, description: 'ProductDescription', images: [ ], location: 'Ort', price: 10.50, priceKind: 100, reviews: [], sellOrLend: 1, status: 1, userId: 1};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
