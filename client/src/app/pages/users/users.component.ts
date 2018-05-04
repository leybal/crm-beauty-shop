import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models';
import { UserService } from '../../services';
import { AuthenticationService } from '../../services';
import { environment } from '../../../environments/environment';
import { ISubscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  currentUser: User;
  users: User[] = [];
  userAuthorized: boolean;
  queryString: string;
  roleFilter: string;
  avatarUrl = environment.avatarUrl;
  private subscription: ISubscription;
  pageSize: number;
  isUsers: boolean;

  constructor(
    private userService: UserService,
    private authentication: AuthenticationService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.roleFilter = 'all';
  }

  ngOnInit() {
    this.loadAllUsers();
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    this.pageSize = 5;
    this.isUsers = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  paginationChangeHandler(e): number {
    let val = e.target.value;
    if (!val) return this.pageSize = 5;
    if (val > 20) return this.pageSize = 20;
    if (val < 1) return this.pageSize = 1;
  }

  private loadAllUsers() {
    this.subscription =  this.userService.getAll()
      .retryWhen(errors => errors.delay(1000))
      .map(users => {
        users.forEach(user => {
          user.avatar = this.avatarUrl + user.avatar;
        });
        return users;
      })
      .subscribe(users => {this.users = users; this.isUsers = true});
  }
}
