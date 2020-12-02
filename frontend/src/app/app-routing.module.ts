import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminUserPanelComponent } from './components/admin-user-panel/admin-user-panel.component';
import { AdminProductPanelComponent } from './components/admin-product-panel/admin-product-panel.component';
import { ProductComponent } from './components/product/product.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import {SharedModule} from './services/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'login/forgot-password', component: ForgotPasswordComponent, canActivate: [NotAuthGuard] },
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
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), SharedModule, BrowserModule, BrowserAnimationsModule, FormsModule, HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
