import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { DeleteProductComponent } from './components/custom/dialog/delete-product/delete-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminUserPanelComponent } from './components/admin-user-panel/admin-user-panel.component';
import { AdminProductPanelComponent } from './components/admin-product-panel/admin-product-panel.component';
import { ProductComponent } from './components/product/product.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { DeleteUserComponent } from './components/custom/dialog/delete-user/delete-user.component';
import { ApproveProductComponent } from './components/custom/dialog/approve-product/approve-product.component';
import { CompactProductListComponent } from './components/custom/compact-product-list/compact-product-list.component';
import { CompactProductCardComponent } from './components/custom/compact-product-card/compact-product-card.component';
import { ProductStatusIconComponent } from './components/custom/product-status-icon/product-status-icon.component';
import {SharedModule} from './services/shared.module';

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
    ProductStatusIconComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, HttpClientModule,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
