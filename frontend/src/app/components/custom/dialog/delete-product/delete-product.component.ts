import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Product,
    private productService: ProductService
  ) { }

  deleteProduct(): void {
    this.productService.deleteProduct(this.data.productId);
    location.reload();
  }
}
