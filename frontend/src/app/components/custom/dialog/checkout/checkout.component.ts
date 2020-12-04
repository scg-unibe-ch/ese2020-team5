import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartService } from '../../../../services/cart.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countryList } from '../../../sign-up/sign-up.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  addressForm: FormGroup;
  user: User;
  countryList = countryList;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { deliverable: boolean, total: number },
    private cartService: CartService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.userService.getUser().then(user => {
      this.user = user;
      this.initializeFormValues();
    });
  }

  initializeForm(): void {
    this.addressForm = this.formBuilder.group({
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      street: ['', [Validators.required]]
    });
  }

  initializeFormValues(): void {
    this.addressForm.get('country').setValue(this.user.country);
    this.addressForm.get('city').setValue(this.user.city);
    this.addressForm.get('zipCode').setValue(this.user.zipCode);
    this.addressForm.get('street').setValue(this.user.street);
  }

  buy(): void {
    this.cartService.buyCartItems((this.data.deliverable ? this.addressForm.value : {}));
    location.reload();
  }
}
