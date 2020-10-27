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
    EditProductComponent
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
    MatProgressSpinnerModule
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
