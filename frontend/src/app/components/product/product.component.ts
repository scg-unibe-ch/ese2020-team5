import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productService.getApprovedProducts().then(approvedProducts => {
        this.product = (approvedProducts.filter(entry => entry.productId === parseInt(params.id, 10)))[0];
        if (!this.product && this.authService.isLoggedIn()) {
          this.userService.getUser().then(user => {
            if (user.isAdmin) {
              this.productService.getUnapprovedProducts().then(unapprovedProducts => {
                this.product = (unapprovedProducts.filter(entry => entry.productId === parseInt(params.id, 10)))[0];
                if (!this.product) {
                  location.assign('catalog');
                }
              });
            } else {
              this.productService.getProductsFromUser().then(userProducts => {
                this.product = (userProducts.filter(entry => entry.productId === parseInt(params.id, 10)))[0];
                if (!this.product) {
                  location.assign('catalog');
                }
              });
            }
          });
        } else if (!this.product && !this.authService.isLoggedIn()) {
          location.assign('catalog');
        }
      });
    });
  }

  closeNotification(): void {
    (document.getElementsByClassName('product-notification') as HTMLCollectionOf<HTMLElement>)[0]
      .style.display = 'none';
  }

  addToCart(): void {
    if (this.authService.isLoggedIn()) {
      // Add to cart
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }
}
