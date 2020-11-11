import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../custom/dialog/delete-user/delete-user.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-panel',
  templateUrl: './admin-user-panel.component.html',
  styleUrls: ['./admin-user-panel.component.css']
})
export class AdminUserPanelComponent implements OnInit {
  users: User[];
  searchFilter = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userService.getAllUsers().then(users => {
      this.route.queryParams.subscribe(params => {
        if (params.q) {
          this.searchFilter = params.q;
          this.users = users.filter(user =>
            (user.userName.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
            || ((user.firstName + ' ' + user.lastName).toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
            || (user.email.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
            || (user.gender.indexOf(this.searchFilter.toLowerCase()) > -1)
            || (user.country.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
            || (user.city.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
            || (user.zipCode.indexOf(this.searchFilter) > -1)
          );
        } else {
          this.users = users;
        }
      });
    });
  }

  filterUsers(): void {
    if (this.searchFilter && this.searchFilter.replace(/ /g, '') !== '') {
      this.router.navigate(['admin/dashboard/users'], { queryParams: { q: this.searchFilter }});
    } else {
      this.router.navigate(['admin/dashboard/users']);
    }
  }

  deleteUser(user: User): void {
    this.dialog.open(DeleteUserComponent, {
      data: user
    });
  }
}
