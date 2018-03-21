import {Component, OnInit} from '@angular/core';

import {User} from '../../models/index';
import {UserService} from '../../services/index';
import {AuthenticationService} from '../../services/index';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  userAuthorized: boolean;
  queryString: string;

  constructor(private userService: UserService,
              private authentication: AuthenticationService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllUsers();
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
  }

  private loadAllUsers() {
    this.userService.getAll().subscribe(users => this.users = users);
  }
}
