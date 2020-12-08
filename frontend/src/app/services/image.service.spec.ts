import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';
import { environment } from '../../environments/environment';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the source url of the image', () => {
    expect(service.getImageUrl('testFile.png')).toBe(environment.endpointURL + 'images/' + 'testFile.png');
  });

  it('should return the original source url', () => {
    const url = 'https://testing.test/test.png';
    expect(service.getImageUrl(url)).toBe(url);
  });
});
