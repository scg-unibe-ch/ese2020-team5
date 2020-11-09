import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  type = 'all';
  searchFilter: string;
  products: Product[];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.type = (this.route.snapshot.queryParams.type) ? this.route.snapshot.queryParams.type : this.type;
    this.productService.getApprovedProducts().then(products => {
      if (this.type === 'items') {
        this.products = products.filter(product => product.type === 0);
      } else if (this.type === 'services') {
        this.products = products.filter(product => product.type === 1);
      } else {
        this.products = products;
      }
      this.searchFilter = this.route.snapshot.queryParams.q;
      if (this.searchFilter) {
        this.products = this.products.filter(product =>
          product.title.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1
          || product.description.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1
        );
      }
    });
  }

  mouseEnterItem(index: number): void {
    document.getElementById('product-description-' + index).style.display = 'block';
  }

  mouseLeaveItem(index: number): void {
    document.getElementById('product-description-' + index).style.display = 'none';
  }
}