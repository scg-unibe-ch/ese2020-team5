import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'login/forgot-password', component: ForgotPasswordComponent, canActivate: [NotAuthGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [NotAuthGuard] },
  { path: 'my-products', component: MyProductsComponent, canActivate: [AuthGuard] },
  { path: 'product/:id/edit', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
