import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  myProducts: Product[];
  filteredProducts: Product[];
  filter = '';

  constructor(
    private productService: ProductService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.productService.getProductsFromUser().then(products => {
      this.myProducts = products;
      this.filteredProducts = this.myProducts;
    });
  }

  navigateTo(page: string): void {
    location.assign(page);
  }

  filterMyProducts(): void {
    this.filteredProducts = this.myProducts.filter(entry =>
      (entry.title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1)
      || (entry.description.toLowerCase().indexOf(this.filter.toLowerCase()) > -1)
    );
  }
}
