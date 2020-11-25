import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cartItem.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems: Product[];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private cartItem: CartItem
  ) { }

  ngOnInit(): void {
  }

}
