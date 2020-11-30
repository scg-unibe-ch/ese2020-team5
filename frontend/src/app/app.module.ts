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
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MatSelectModule } from '@angular/material/select';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { MatIconModule } from '@angular/material/icon';
import { LogoutComponent } from './components/logout/logout.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DeleteProductComponent } from './components/custom/dialog/delete-product/delete-product.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminUserPanelComponent } from './components/admin-user-panel/admin-user-panel.component';
import { AdminProductPanelComponent } from './components/admin-product-panel/admin-product-panel.component';
import { ProductComponent } from './components/product/product.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteUserComponent } from './components/custom/dialog/delete-user/delete-user.component';
import { ApproveProductComponent } from './components/custom/dialog/approve-product/approve-product.component';
import { CompactProductListComponent } from './components/custom/compact-product-list/compact-product-list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule} from '@angular/material/menu';
import { CompactProductCardComponent } from './components/custom/compact-product-card/compact-product-card.component';
import { ProductStatusIconComponent } from './components/custom/product-status-icon/product-status-icon.component';
import { StarRatingComponent } from './components/custom/star-rating/star-rating.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignUpComponent,
    ProfileComponent,
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
    InboxComponent
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
