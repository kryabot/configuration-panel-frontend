import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../model/User.model';

@Injectable()
export class UserService {
  constructor() {
  }

  getUser(): Observable<User> {
    return observableOf(JSON.parse(localStorage.getItem('currentUser')));
  }

  setUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }


}
