import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-purchased-products',
  templateUrl: './purchased-products.component.html',
  styleUrls: ['./purchased-products.component.css']
})
export class PurchasedProductsComponent implements OnInit {
  products: Product[];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productService.getPurchasedProducts().then(product => this.products = product.reverse());
  }

}
