import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { DeleteProductComponent } from '../custom-components/dialog/delete-product/delete-product.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApproveProductComponent } from '../custom-components/dialog/approve-product/approve-product.component';

@Component({
  selector: 'app-admin-product-panel',
  templateUrl: './admin-product-panel.component.html',
  styleUrls: ['./admin-product-panel.component.css']
})
export class AdminProductPanelComponent implements OnInit {
  allProducts: Product[];
  unapprovedProducts: Product[];
  approvedProducts: Product[];
  products: Product[];
  filter = null;
  searchFilter = '';

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productService.getUnapprovedProducts().then(unapprovedProducts => {
      this.unapprovedProducts = unapprovedProducts;
      this.productService.getApprovedProducts().then(approvedProducts => {
        this.approvedProducts = approvedProducts;
        this.allProducts = this.approvedProducts.concat(this.unapprovedProducts);
        this.products = this.allProducts;
        this.route.queryParams.subscribe(params => {
          if (params.approved === '0') {
            this.filter = 2;
            this.products = this.unapprovedProducts;
          } else if (params.approved === '1') {
            this.filter = 1;
            this.products = this.approvedProducts;
          } else {
            this.filter = 0;
            this.products = this.allProducts;
          }
          if (params.q) {
            this.searchFilter = params.q;
            this.products = this.products.filter(entry =>
              (entry.title.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
              || (entry.description.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
            );
          }
        });
      });
    });
  }

  filterProducts(): void {
    let queryParams: any = {};
    if (this.filter === 0) {
    } else if (this.filter === 1) {
      queryParams = Object.assign(queryParams, { approved: 1 });
    } else {
      queryParams = Object.assign(queryParams, { approved: 0 });
    }
    if (this.searchFilter.replace(/ /g, '') !== '') {
      queryParams = Object.assign(queryParams, { q: this.searchFilter });
    }
    this.router.navigate(['/admin/dashboard/products'], { queryParams });
  }
}
