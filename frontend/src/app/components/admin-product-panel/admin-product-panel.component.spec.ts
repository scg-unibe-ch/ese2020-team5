import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminProductPanelComponent } from './admin-product-panel.component';
import {ProductService} from '../../services/product.service';

describe('AdminProductPanelComponent', () => {
  let component: AdminProductPanelComponent;
  let fixture: ComponentFixture<AdminProductPanelComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductPanelComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should create`, async(inject([HttpTestingController, ProductService],
    (httpClient: HttpTestingController, productService: ProductService) => {
      expect(productService).toBeTruthy();
    })));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
