import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { RechargeCreditsComponent } from '../custom-components/dialog/recharge-credits/recharge-credits.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: User;
  links = [
    {
      url: 'profile',
      name: 'Profile'
    },
    {
      url: 'reviews',
      name: 'My Reviews'
    },
    {
      url: 'wishlist',
      name: 'My Wishlist'
    },
    {
      url: 'purchase-history',
      name: 'Purchase History'
    }
  ];
  section = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.section = this.route.snapshot.children[0].url[0].path;
    this.userService.getUser().then(user => this.user = user);
  }

  navigateTo(path: string): void {
    this.router.navigate(['account/' + path]).then(() => this.section = path);
  }

  openRechargeDialog(): void {
    this.dialog.open(RechargeCreditsComponent);
  }
}
