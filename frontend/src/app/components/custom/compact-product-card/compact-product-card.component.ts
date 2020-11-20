import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-compact-product-card',
  templateUrl: './compact-product-card.component.html',
  styleUrls: ['./compact-product-card.component.css']
})
export class CompactProductCardComponent implements OnInit {
  @Input()
  product: Product;
  @Input()
  index: number;

  constructor(public imageService: ImageService) { }

  ngOnInit(): void {
  }

  mouseEnterItem(): void {
    document.getElementById('product-description-' + this.index).style.display = '-webkit-box';
  }

  mouseLeaveItem(): void {
    document.getElementById('product-description-' + this.index).style.display = 'none';
  }
}
