import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: Product = null;
  productForm: FormGroup;
  id: number;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productService.getProductsFromUser().then(products => {
        this.id = params.id;
        this.product = (products.filter(entry => entry.productId === parseInt(params.id, 10)))[0];
        if (this.product) {
          this.initialize();
        }
      });
    });
  }

  initialize(): void {
    this.productForm = this.formBuilder.group({
      title: [this.product.title, [Validators.required]],
      type: [this.product.type, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      location: [this.product.location, [Validators.required]],
      sellOrLend: [this.product.sellOrLend, [Validators.required]],
      price: [this.product.price, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      priceKind: [this.product.priceKind, [Validators.required]],
      status: [this.product.status, [Validators.required]],
      deliverable: [this.product.deliverable, [Validators.required]]
    });
    this.productForm.get('type').valueChanges.subscribe(x => {
      if (x === 1) {
        this.productForm.get('sellOrLend').setValue(0);
        this.productForm.get('deliverable').setValue(false);
      }
      if ((x === 0) && this.productForm.get('priceKind').value !== 0) {
        this.productForm.get('sellOrLend').setValue(1);
      }
    });
    this.productForm.get('priceKind').valueChanges.subscribe(x => {
      if ((x !== 0) && this.productForm.get('type').value === 0) {
        this.productForm.get('sellOrLend').setValue(1);
      }
    });
  }

  updateProduct(): void {
    this.productService.updateProduct(Object.assign({ productId: this.product.productId }, this.productForm.value))
      .then(() => {
        location.assign(
          (this.route.snapshot.queryParams.link) ? this.route.snapshot.queryParams.link : ('/product/' + this.id)
        );
      });
  }

  cancelUpdate(): void {
    location.assign(
      (this.route.snapshot.queryParams.link) ? this.route.snapshot.queryParams.link : ('/product/' + this.id)
    );
  }
}
