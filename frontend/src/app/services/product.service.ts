import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient: HttpClient) { }

  getProductsFromUser(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'products').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  createProduct(product: Product): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'products', product).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  updateProduct(product: Product): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'products/' + product.productId, product).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteProduct(productId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'products/' + productId).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
