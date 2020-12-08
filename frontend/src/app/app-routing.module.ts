import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminUserPanelComponent } from './pages/admin-user-panel/admin-user-panel.component';
import { AdminProductPanelComponent } from './pages/admin-product-panel/admin-product-panel.component';
import { ProductComponent } from './pages/product/product.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { AccountComponent } from './pages/account/account.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { ReviewsComponent } from './pages/account/reviews/reviews.component';
import { WishlistComponent } from './pages/account/wishlist/wishlist.component';
import { UserComponent } from './pages/user/user.component';
import { PurchasedProductsComponent } from './pages/account/purchased-products/purchased-products.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full'},
  { path: 'profile', redirectTo: 'account/profile', pathMatch: 'full' },
  { path: 'wishlist', redirectTo: 'account/wishlist', pathMatch: 'full' },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'purchase-history', component: PurchasedProductsComponent}
    ]
  },
  { path: 'user/:id', component: UserComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [NotAuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'catalog', component: CatalogComponent },
  { path: 'my-products', component: MyProductsComponent, canActivate: [AuthGuard] },
  { path: 'my-products/new', component: CreateProductComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductComponent },
  { path: 'product/:id/edit', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminPanelComponent, canActivate: [AdminGuard] },
  { path: 'admin/dashboard/users', component: AdminUserPanelComponent, canActivate: [AdminGuard] },
  { path: 'admin/dashboard/products', component: AdminProductPanelComponent, canActivate: [AdminGuard] },
  { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/catalog' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
