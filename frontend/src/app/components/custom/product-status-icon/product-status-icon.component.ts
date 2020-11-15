import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-status-icon',
  templateUrl: './product-status-icon.component.html',
  styleUrls: ['./product-status-icon.component.css']
})
export class ProductStatusIconComponent implements OnInit {
  @Input()
  product: Product;

  constructor() { }

  ngOnInit(): void {
  }
}
