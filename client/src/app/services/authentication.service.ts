import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
  apiUrl = environment.apiUrl;
  userAuthorized = this.getUserLoggedIn();

  constructor(private http: HttpClient) { }

  getUserLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.apiUrl + 'login', {email: email, password: password})
      .map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.userAuthorized = this.getUserLoggedIn();
        return user;
      });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.userAuthorized = this.getUserLoggedIn();
  }
}
