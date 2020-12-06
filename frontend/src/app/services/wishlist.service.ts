import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WishlistEntry } from '../models/wishlistentry.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  constructor(private httpClient: HttpClient) { }

  getWishlist(): Promise<WishlistEntry[]> {
    return new Promise<WishlistEntry[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'wishlist').subscribe((wishlistEntries: WishlistEntry[]) => {
        resolve(wishlistEntries);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  addToWishlist(productId: number): Promise<WishlistEntry> {
    return new Promise<WishlistEntry>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'wishlist/' + productId, {}).subscribe((wishlistEntry: WishlistEntry) => {
        resolve(wishlistEntry);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  removeFromWishlist(productId: number): Promise<WishlistEntry> {
    return new Promise<WishlistEntry>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'wishlist/' + productId).subscribe((wishlistEntry: WishlistEntry) => {
        resolve(wishlistEntry);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
