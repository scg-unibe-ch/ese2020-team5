import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cartItem.model';
import { environment } from '../../environments/environment';
import { ProductImage } from '../models/productImage.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient: HttpClient) { }

  getApprovedProducts(): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'products/catalog').subscribe((products: Product[]) => {
        resolve(products);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getProductById(productId: number): Promise<Product> {
    return new Promise<Product>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'products/' + productId).subscribe((product: Product) => {
        resolve(product);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getProductsFromUser(): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'products').subscribe((products: Product[]) => {
        resolve(products);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  createProduct(product: Product): Promise<Product> {
    return new Promise<Product>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'products', product).subscribe((createdProduct: Product) => {
        resolve(createdProduct);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  updateProduct(product: Product): Promise<Product> {
    return new Promise<Product>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'products/' + product.productId, product).subscribe((updatedProduct: Product) => {
        resolve(updatedProduct);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteProduct(productId: number): Promise<Product> {
    return new Promise<Product>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'products/' + productId).subscribe((product: Product) => {
        resolve(product);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  addImage(productId: number, file: File): Promise<ProductImage> {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return new Promise<ProductImage>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'products/' + productId + '/image', formData)
        .subscribe((productImage: ProductImage) => {
          resolve(productImage);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  deleteImage(imageId: number): Promise<ProductImage> {
    return new Promise<ProductImage>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'products/image/' + imageId).subscribe((productImage: ProductImage) => {
        resolve(productImage);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  // ---Only for Admins--- //
  getUnapprovedProducts(): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'products/admin-catalog').subscribe((products: Product[]) => {
        resolve(products);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  approveProduct(productId: number): Promise<Product> {
    return new Promise<Product>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'products/' + productId, { approved: 1 }).subscribe((product: Product) => {
        resolve(product);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  addToCart(cartItem: CartItem) {
    return new Promise<CartItem>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + ':id', cartItem).subscribe((createdCart: CartItem) => {
        resolve(createdCart);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
