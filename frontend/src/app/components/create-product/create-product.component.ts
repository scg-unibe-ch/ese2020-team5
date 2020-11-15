import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
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
      status: [''],
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
    this.productService.createProduct(this.createProductForm.value).then((data: any) => {
      this.showErrorMessage = false;
      console.log(data);
      location.assign('my-products');
    }).catch((error: any) => {
      console.log(error);
      this.showErrorMessage = true;
    });
  }
}
