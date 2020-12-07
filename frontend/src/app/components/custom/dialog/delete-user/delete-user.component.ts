import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: User,
    private userService: UserService
  ) { }

  deleteUser(): void {
    this.userService.deleteUser(this.data.userId).then(() => location.reload());
  }
}
