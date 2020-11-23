import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ApproveProductComponent } from '../dialog/approve-product/approve-product.component';
import { DeleteProductComponent } from '../dialog/delete-product/delete-product.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { ImageService } from '../../../services/image.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-compact-product-list',
  templateUrl: './compact-product-list.component.html',
  styleUrls: ['./compact-product-list.component.css']
})
export class CompactProductListComponent implements OnInit {
  @Input()
  product: Product;
  @Input()
  view = 'customer';
  user: User;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    public imageService: ImageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.userService.getUser().then(user => this.user = user).catch(() => this.authService.logout());
    }
  }

  isProductOwner(): boolean {
    return (this.user && (this.product.userId === this.user.userId));
  }

  navigateToProduct(): void {
    location.assign('/product/' + this.product.productId);
  }

  approveProduct(): void {
    if (this.user && this.user.isAdmin) {
      this.dialog.open(ApproveProductComponent, {
        data: this.product
      });
    }
  }

  editProduct(): void {
    if (this.isProductOwner()) {
      location.assign('product/' + this.product.productId + '/edit?link=' + this.router.url);
    }
  }

  deleteProduct(): void {
    if (this.user && this.user.isAdmin) {
      this.dialog.open(DeleteProductComponent, {
        data: this.product
      });
    }
  }
}
