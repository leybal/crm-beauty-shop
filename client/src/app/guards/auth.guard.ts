import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/index";

@Injectable()
export class AuthGuard implements CanActivate {
  userAuthorized: boolean;

  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.userAuthorized) {
      return true;
    }
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
