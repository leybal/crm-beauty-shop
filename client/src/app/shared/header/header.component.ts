import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {
  userAuthorized: boolean;

  constructor(
    private router: Router,
    private authentication: AuthenticationService) { }

  ngOnInit() {
    this.userAuthorized = this.authentication.userAuthorized;
  }

  logOut() {
    this.authentication.logout();
    //this.router.navigate(['/']);
  }

  ngDoCheck() {
    this.userAuthorized = this.authentication.userAuthorized;
  }
}
