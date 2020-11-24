import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  createProductForm: FormGroup;
  showErrorMessage = false;
  userId: number;
  product: Product = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.createProductForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      sellOrLend: ['', [Validators.required]],
      priceKind: ['', [Validators.required]],
      location: ['', [Validators.required]],
      deliverable: ['', [Validators.required]],
      status: ['', [Validators.required]],
      userId: ['']
    });
    this.userService.getUser().then(user => {
      this.createProductForm.get('userId').setValue(user.userId);
    });
    this.createProductForm.get('type').valueChanges.subscribe(x => {
      if (x === 1) {
        this.createProductForm.get('sellOrLend').setValue(0);
        this.createProductForm.get('deliverable').setValue(false);
      }
      if ((x === 0) && this.createProductForm.get('priceKind').value !== 0) {
        this.createProductForm.get('sellOrLend').setValue(1);
      }
    });
    this.createProductForm.get('priceKind').valueChanges.subscribe(x => {
      if ((x !== 0) && this.createProductForm.get('type').value === 0) {
        this.createProductForm.get('sellOrLend').setValue(1);
      }
    });
  }

  createProduct(): void {
    this.productService.createProduct(this.createProductForm.value).then(() => {
      this.showErrorMessage = false;
      location.assign('my-products');
    }).catch((error) => {
      this.showErrorMessage = true;
    });
  }
}
