import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from '../../services';
import { Router } from "@angular/router";
import { User } from "../../models";
import { trigger,state,style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1'
      })),
      state('closed',   style({
        opacity: '0',
        display: 'none',
      })),
      transition('closed => open', animate('300ms ease-in')),
      transition('open => closed', animate('100ms ease-out'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  userAuthorized: boolean;
  currentUser: User;
  isNavbarCollapsed = true;
  _isNavbarCollapsedAnim = 'closed';

  constructor(
    private router: Router,
    private authentication: AuthenticationService
  ) { }

  ngOnInit() {
    this.authentication.cast.subscribe(userAuthorized => {
      this.userAuthorized = userAuthorized;
      if (this.userAuthorized) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }
    });
    this.onResize(window);
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(event) {
    let resizeTimeout;

    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        actualResizeHandler(this);
      }, 100);
    }

    function actualResizeHandler(that) {
      if(event.innerWidth > 767){
        //need to set this to 'open' for large screens to show up because of opacity in 'closed' animation.
        that._isNavbarCollapsedAnim = 'open';
        that.isNavbarCollapsed = true;
      }else{
        // comment this line if you don't want to collapse the navbar when window is resized.
        // this._isNavbarCollapsedAnim = 'closed';
      }
    }
  }

  toggleNavbar(): void {
    if(this.isNavbarCollapsed){
      this._isNavbarCollapsedAnim = 'open';
      this.isNavbarCollapsed = false;
    } else {
      this._isNavbarCollapsedAnim = 'closed';
      this.isNavbarCollapsed = true;
    }
  }

  get isNavbarCollapsedAnim() : string {
    return this._isNavbarCollapsedAnim;
  }

  public logOut() {
    this.authentication.logout();
  }
}
