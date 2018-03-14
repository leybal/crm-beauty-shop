import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from "@angular/router";
import { User } from "../../models";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userAuthorized: boolean;
  currentUser: User;

  constructor(
    private router: Router,
    private authentication: AuthenticationService) { }

  ngOnInit() {
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    if (this.userAuthorized) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  logOut() {
    this.authentication.logout();
  }
}
