import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';




@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit {
  createListingForm: FormGroup;
  showErrorMessage = false;


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private productService: ProductService
    ) { }

  ngOnInit(): void {
    this.createListingForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required]],
      sellOrLend: ['', [Validators.required]],
      priceKind: ['', [Validators.required]],
      location: ['', [Validators.required]],
      deliverable: ['', [Validators.required]],
      images: [''],
      productId: [''],
      userId: [''],
      status: [''],
      approved: [''],
    });
  }

  createListing(): void {
    this.productService.createProduct(this.createListingForm.value).then((data: any) => {
      this.showErrorMessage = false;
      console.log(data);
      location.assign('home');
    }).catch((error: any) => {
      console.log(error);
      this.showErrorMessage = true;
    });
  }


}