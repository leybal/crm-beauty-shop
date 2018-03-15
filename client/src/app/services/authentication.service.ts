import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
  apiUrl = environment.apiUrl;
  private  userAuthorized = new BehaviorSubject<boolean>(this.getUserLoggedIn());
  cast = this.userAuthorized.asObservable();

  constructor(private http: HttpClient) { }

  editUserAuthorized(value: boolean) {
    this.userAuthorized.next(value);
  }

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
        this.editUserAuthorized(this.getUserLoggedIn());
        return user;
      });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.editUserAuthorized(this.getUserLoggedIn());
  }
}
