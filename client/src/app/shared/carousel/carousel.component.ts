import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ISubscription } from "rxjs/Subscription";
import { environment } from '../../../environments/environment';
import { User } from './../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  users: User[] = [];
  avatarUrl = environment.avatarUrl;
  public items: object[] = [];
  public carouselConfig: NgxCarousel;
  private subscription: ISubscription;

  constructor(private userService: UserService) { }

  private loadAllUsers() {
    this.subscription = this.userService.getAll()
      .map(users => {
        users.forEach(user => {
          user.avatar = this.avatarUrl + user.avatar;
          if (user.role === 'master') {
            this.items.push(
              {
                name: user.name,
                color: 'f1f1f1',
                src: user.avatar,
                id: user.id
              }
            );
            console.log(user);
          }
        });
        return users;
      })
      .subscribe(users => this.users = users);
  }

  ngOnInit() {
    this.loadAllUsers();

    this.carouselConfig = {
      grid: {xs: 3, sm: 5, md: 5, lg: 5, all: 0},
      slide: 1,
      speed: 400,
      interval: 10000,
      point: {
        visible: false
      },
      loop: true,
      touch: true
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
