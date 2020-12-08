import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-recharge-credits',
  templateUrl: './recharge-credits.component.html',
  styleUrls: ['./recharge-credits.component.css']
})
export class RechargeCreditsComponent implements OnInit {
  user: User;
  amount = 0;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().then(user => this.user = user);
  }

  recharge(): void {
    if (!isNaN(this.amount)) {
      if (this.amount > 9999) {
        this.amount = 9999;
      }
      this.userService.rechargeCredits(this.user.credits + this.amount).then(() => location.reload());
    }
  }
}
