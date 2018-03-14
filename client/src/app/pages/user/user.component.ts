import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, AuthenticationService } from "../../services/index";
import { User } from "../../models/index";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;
  userAuthorized: boolean;
  currentUser: User;
  profileOwner: boolean;

  constructor(
    private userService: UserService,
    private currentRout: ActivatedRoute,
    private authentication: AuthenticationService
  ) {
    this.profileOwner = false;
  }

  ngOnInit() {
    const id: string = this.currentRout.snapshot.paramMap.get('id');
    this.userService.getById(id).subscribe(user => {
      this.user = user;
      this.user.avatar = 'https://beautyshop-server.herokuapp.com/images/avatars/' + user.avatar;
    });

    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    if (this.userAuthorized) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    if (id === this.currentUser.id) {
      this.profileOwner = true;
    }
  }
}
