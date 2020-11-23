import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor() { }

  getImageUrl(fileName: string): string {
    return (fileName.indexOf('://') > -1) ? fileName : (environment.endpointURL + 'images/' + fileName);
  }
}
