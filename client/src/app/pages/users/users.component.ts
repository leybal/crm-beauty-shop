import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/index';
import { UserService } from '../../services/index';
import { AuthenticationService } from '../../services/index';
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
  avatarUrl = environment.avatarUrl;
  private subscription: ISubscription;

  constructor(
    private userService: UserService,
    private authentication: AuthenticationService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllUsers();
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      .subscribe(users => this.users = users);
  }
}
