import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-approve-product',
  templateUrl: './approve-product.component.html',
  styleUrls: ['./approve-product.component.css']
})
export class ApproveProductComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Product,
    private productService: ProductService
  ) { }

  approveProduct(): void {
    this.productService.approveProduct(this.data.productId).then(() => location.reload());
  }
}
