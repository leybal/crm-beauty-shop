import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    active;

    setActive(value: boolean) {
      this.active = value;
    }

    getActive() {
      return this.active;
    }

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{

      return confirm('Вы уверены, что хотите перейти?');

    }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //     if (localStorage.getItem('currentUser')) {
    //         // logged in so return true
    //         return true;
    //     }
    //
    //     // not logged in so redirect to login page with the return url
    //     this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
    //     return false;

}
