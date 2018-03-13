import {Component, DoCheck, OnInit} from '@angular/core';

import { User } from '../../models/index';
import { UserService } from '../../services/index';
import { AuthenticationService } from '../../services/index';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, DoCheck {
  currentUser: User;
  users: User[] = [];
  userAuthorized: boolean;

  constructor(
    private userService: UserService,
    private authentication: AuthenticationService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllUsers();
    this.userAuthorized = this.authentication.userAuthorized;
  }

  ngDoCheck() {
    this.userAuthorized = this.authentication.userAuthorized;
  }

  private loadAllUsers() {
    this.userService.getAll().subscribe(users => this.users = users);
  }
}
