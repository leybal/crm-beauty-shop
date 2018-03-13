import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/index";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor( private authentication: AuthenticationService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      if (this.authentication.userAuthorized) {
        return true;
      }
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
}
