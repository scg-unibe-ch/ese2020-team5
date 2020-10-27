import {Component, OnInit} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  myProducts: Product[] = [];
  filteredProducts: Product[];
  filter = '';
  imageIndex = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productService.getProductsFromUser().then(data => {
      this.myProducts = data;
      this.filteredProducts = this.myProducts;
      document.addEventListener('DOMContentLoaded', (event) => {
        this.initialize();
      });
    }).catch(() => {
      this.myProducts = null;
      this.filteredProducts = this.myProducts;
    });
  }

  initialize(): void {
    if (this.myProducts) {
      this.myProducts.forEach((product, index) => {
        this.imageIndex.push(null);
        if (product.images && product.images[0]) {
          this.imageIndex[index] = 0;
          document.getElementById('image-' + index + ':' + 0).style.display = 'block';
          document.getElementById('dot-' + index + ':' + 0).className += ' dot-active';
        }
      });
    }
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

  nextImage(i: number, n: number): void {
    document.getElementById('image-' + i + ':' + this.imageIndex[i]).style.display = 'none';
    document.getElementById('dot-' + i + ':' + this.imageIndex[i]).classList.remove('dot-active');
    if ((this.imageIndex[i] + n) > (this.myProducts[i].images.length - 1)) {
      this.imageIndex[i] = 0;
    } else if ((this.imageIndex[i] + n) < 0) {
      this.imageIndex[i] = this.myProducts[i].images.length - 1;
    } else {
      this.imageIndex[i] += n;
    }
    document.getElementById('image-' + i + ':' + this.imageIndex[i]).style.display = 'block';
    document.getElementById('dot-' + i + ':' + this.imageIndex[i]).classList.add('dot-active');
  }

  setImage(i: number, n: number): void {
    document.getElementById('image-' + i + ':' + this.imageIndex[i]).style.display = 'none';
    document.getElementById('dot-' + i + ':' + this.imageIndex[i]).classList.remove('dot-active');
    this.imageIndex[i] = n;
    document.getElementById('image-' + i + ':' + this.imageIndex[i]).style.display = 'block';
    document.getElementById('dot-' + i + ':' + this.imageIndex[i]).classList.add('dot-active');
  }

  editProduct(id: number): void {}

  deleteProduct(product: Product): void {}
}
