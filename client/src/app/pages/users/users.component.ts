import {Component, OnInit, OnDestroy } from '@angular/core';

import { User } from '../../models/index';
import { UserService } from '../../services/index';
import { AuthenticationService } from '../../services/index';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  currentUser: User;
  users: User[] = [];
  userAuthorized: boolean;
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
    this.subscription =  this.userService.getAll().subscribe(users => this.users = users);
  }
}
