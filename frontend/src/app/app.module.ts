import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { MatSelectModule } from '@angular/material/select';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { MatIconModule } from '@angular/material/icon';
import { LogoutComponent } from './pages/logout/logout.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DeleteProductComponent } from './pages/custom-components/dialog/delete-product/delete-product.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AdminUserPanelComponent } from './pages/admin-user-panel/admin-user-panel.component';
import { AdminProductPanelComponent } from './pages/admin-product-panel/admin-product-panel.component';
import { ProductComponent } from './pages/product/product.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteUserComponent } from './pages/custom-components/dialog/delete-user/delete-user.component';
import { ApproveProductComponent } from './pages/custom-components/dialog/approve-product/approve-product.component';
import { CompactProductListComponent } from './pages/custom-components/compact-product-list/compact-product-list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule} from '@angular/material/menu';
import { CompactProductCardComponent } from './pages/custom-components/compact-product-card/compact-product-card.component';
import { ProductStatusIconComponent } from './pages/custom-components/product-status-icon/product-status-icon.component';
import { StarRatingComponent } from './pages/custom-components/star-rating/star-rating.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './pages/custom-components/dialog/checkout/checkout.component';
import { ProductFormComponent } from './pages/custom-components/product-form/product-form.component';
import { ReviewFormComponent } from './pages/custom-components/dialog/review-form/review-form.component';
import { AccountComponent } from './pages/account/account.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { ReviewsComponent } from './pages/account/reviews/reviews.component';
import { WishlistComponent } from './pages/account/wishlist/wishlist.component';
import { DeleteReviewComponent } from './pages/custom-components/dialog/delete-review/delete-review.component';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    CreateProductComponent,
    LogoutComponent,
    MyProductsComponent,
    DeleteProductComponent,
    EditProductComponent,
    AdminPanelComponent,
    AdminUserPanelComponent,
    AdminProductPanelComponent,
    ProductComponent,
    CatalogComponent,
    DeleteUserComponent,
    ApproveProductComponent,
    CompactProductListComponent,
    CompactProductCardComponent,
    ProductStatusIconComponent,
    StarRatingComponent,
    InboxComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    ProductFormComponent,
    ReviewFormComponent,
    AccountComponent,
    ProfileComponent,
    ReviewsComponent,
    WishlistComponent,
    DeleteReviewComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatTabsModule,
    MatToolbarModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatRadioModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatBadgeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
