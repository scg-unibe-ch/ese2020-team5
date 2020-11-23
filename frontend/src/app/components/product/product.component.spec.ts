import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should add items to "data"', () => {
    expect(component.data.length).toBe(1); // since you have initialized the variable
    component.productName = "Prod1";
    component.quantity = 1;
    component.addItem();  // this will trigger the method
    expect(component.data.length).toBe(4); // this will show that the entry was added in "this.data"
  });
  describe('when a user deletes a product', () => {
    beforeEach(() => {
      getProducts()[0].componentInstance.productDelete.emit();
    });
  });
  it('should delete the product', () => {
    expect(dependencies.productService.deleteProduct).toHaveBeenCalledWith(
      'product'
    );
  });
});
