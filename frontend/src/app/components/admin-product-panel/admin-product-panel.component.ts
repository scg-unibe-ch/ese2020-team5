import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { DeleteProductComponent } from '../custom/dialog/delete-product/delete-product.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

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
  filter = 0;

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
        });
      });
    });
  }

  filterProducts(): void {
    if (this.filter === 0) {
      this.router.navigate(['/admin/dashboard/products']);
    } else if (this.filter === 1) {
      this.router.navigate(['/admin/dashboard/products'], { queryParams: { approved : 1 }});
    } else {
      this.router.navigate(['/admin/dashboard/products'], { queryParams: { approved : 0 }});
    }
  }

  approveProduct(productId: number): void {
    this.productService.approveProduct(productId).then(() => {
      location.reload();
    });
  }

  deleteProduct(product: Product): void {
    this.dialog.open(DeleteProductComponent, {
      data: product
    });
  }
}
