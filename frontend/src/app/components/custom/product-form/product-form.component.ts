import {Component, Input, OnInit} from '@angular/core';
import { Product } from '../../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductImage } from '../../../models/productImage.model';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../../../services/image.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product;
  user: User;
  productForm: FormGroup;
  showImage = false;
  images: ProductImage[] = [];
  addedImages: { file: File, imgSrc: any }[] = [];
  removeImages: number[] = [];
  imgSrc = '';

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initSubFormChanges();
    if (this.product) {
      this.initializeFormValues();
      this.images = this.product.images;
    }
    this.userService.getUser().then(user => {
      this.user = user;
    });
  }

  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      sellOrLend: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      priceKind: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      status: [true, [Validators.required]],
      deliverable: [false, [Validators.required]]
    });
  }

  initSubFormChanges(): void {
    this.productForm.get('type').valueChanges.subscribe(x => {
      if (x === 1) {
        this.productForm.get('sellOrLend').setValue(0);
        this.productForm.get('deliverable').setValue(false);
        this.productForm.get('amount').setValue(1);
        this.productForm.get('amount').disable();
      }
      if (x === 0) {
        this.productForm.get('amount').enable();
        if (this.productForm.get('priceKind').value !== '' && this.productForm.get('priceKind').value !== 0) {
          this.productForm.get('sellOrLend').setValue(1);
        }
      }
    });
    this.productForm.get('priceKind').valueChanges.subscribe(x => {
      if ((x !== 0) && this.productForm.get('type').value === 0) {
        this.productForm.get('sellOrLend').setValue(1);
      }
    });
  }

  initializeFormValues(): void {
    this.productForm.get('deliverable').setValue(this.product.deliverable);
    this.productForm.get('status').setValue(this.product.status);
    this.productForm.get('amount').setValue(this.product.amount);
    this.productForm.get('priceKind').setValue(this.product.priceKind);
    this.productForm.get('price').setValue(this.product.price);
    this.productForm.get('sellOrLend').setValue(this.product.sellOrLend);
    this.productForm.get('location').setValue(this.product.location);
    this.productForm.get('description').setValue(this.product.description);
    this.productForm.get('type').setValue(this.product.type);
    this.productForm.get('title').setValue(this.product.title);
  }

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0] as File;
      const imgSrc = '';
      this.addedImages.push({ file, imgSrc });
      const reader = new FileReader();
      reader.onload = () => {
        this.addedImages[this.addedImages.length - 1].imgSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.removeImages.push(this.images[index].imageId);
    this.images.splice(index, 1);
  }

  removeAddedImage(index: number): void {
    this.addedImages.splice(index, 1);
  }

  createProduct(): void {
    if (isNaN(parseInt(this.productForm.get('amount').value, 10)) || parseInt(this.productForm.get('amount').value, 10) < 0) {
      this.productForm.get('amount').setValue(0);
    }
    this.productForm.get('amount').enable();
    this.productService.createProduct(Object.assign(this.productForm.value, { approved: 0, userId: this.user.userId })).then(product => {
      this.uploadImages(product.productId).then(() => {
        location.assign(
          (this.route.snapshot.queryParams.link) ? this.route.snapshot.queryParams.link
            : (this.product ? '/product/' + this.product.productId : 'my-products')
        );
      });
    });
  }

  updateProduct(): void {
    if (isNaN(parseInt(this.productForm.get('amount').value, 10)) || parseInt(this.productForm.get('amount').value, 10) < 0) {
      this.productForm.get('amount').setValue(0);
    }
    this.productService.updateProduct(Object.assign({ productId: this.product.productId }, this.productForm.value))
      .then(() => {
        this.uploadImages().then(() => {
          location.assign(
            (this.route.snapshot.queryParams.link) ? this.route.snapshot.queryParams.link
              : (this.product ? '/product/' + this.product.productId : 'my-products')
          );
        });
      });
  }

  async uploadImages(productId?: number): Promise<void> {
    if (this.addedImages.length > 0) {
      for (const image of this.addedImages) {
        await this.productService.addImage((productId ? productId : this.product.productId), image.file);
      }
      if (this.product) {
        return this.deleteImages();
      } else {
        return Promise.resolve();
      }
    } else {
      if (this.product) {
        return this.deleteImages();
      } else {
        return Promise.resolve();
      }
    }
  }

  async deleteImages(): Promise<void> {
    if (this.removeImages.length > 0) {
      for (const imageId of this.removeImages) {
        await this.productService.deleteImage(imageId);
      }
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }

  cancelUpdate(): void {
    location.assign(
      (this.route.snapshot.queryParams.link) ? this.route.snapshot.queryParams.link
        : (this.product ? '/product/' + this.product.productId : 'my-products')
    );
  }

  displayImage(src: any): void {
    this.showImage = !this.showImage;
    this.imgSrc = src;
  }
}
