import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PublicUser } from '../../models/publicUser.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: PublicUser;
  products: Product[];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.params.id;
    this.userService.getUserById(userId).then(user => {
      this.user = user;
      this.productService.getProductsByUserId(user.userId).then(products => this.products = products);
    });
  }
}
