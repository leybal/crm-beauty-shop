import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, AuthenticationService } from "../../services";
import { User } from "../../models";
import { environment } from '../../../environments/environment';
import { ISubscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;
  userAuthorized: boolean;
  currentUser: User;
  profileOwner: boolean = false;
  avatarUrl = environment.avatarUrl;
  private subscription: ISubscription;

  constructor(
    private userService: UserService,
    private currentRout: ActivatedRoute,
    private authentication: AuthenticationService
  ) { }

  ngOnInit() {
    const id: string = this.currentRout.snapshot.paramMap.get('id');
    this.subscription = this.userService.getById(id)
      .map(user => {
        user.avatar = this.avatarUrl + user.avatar;
        return user;
      })
      .subscribe(user => this.user = user);

    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    if (this.userAuthorized) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    if (id === this.currentUser.id) {
      this.profileOwner = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
