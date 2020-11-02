import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../custom/dialog/delete-user/delete-user.component';

@Component({
  selector: 'app-admin-user-panel',
  templateUrl: './admin-user-panel.component.html',
  styleUrls: ['./admin-user-panel.component.css']
})
export class AdminUserPanelComponent implements OnInit {
  users: User[];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userService.getAllUsers().then(users => {
      this.users = users;
      console.log(users);
    });
  }

  deleteUser(user: User): void {
    this.dialog.open(DeleteUserComponent, {
      data: user
    });
  }
}
