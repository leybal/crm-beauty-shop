import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { User } from '../models/index';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<User[]>(this.apiUrl + 'users');
  }

  getById(id: string) {
    return this.http.get<User>(this.apiUrl + 'users/' + id);
  }

  create(user: any) {
    return this.http.post<User>(this.apiUrl + 'users', user);
  }

  update(user: any, id: string) {
    return this.http.put<User>(this.apiUrl + 'users/' + id, user);
  }

  delete(id: number) {
    return this.http.delete(this.apiUrl + 'users/' + id);
  }

  updateLocalData(user: User): void {
    const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    user.token = currentUser.token;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
