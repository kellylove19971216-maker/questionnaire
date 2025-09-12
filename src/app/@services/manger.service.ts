import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangerService {

  //本人
  private isAdmin$ = new BehaviorSubject<boolean>(false);

  //觀察
  _isAdmin$ = this.isAdmin$.asObservable();

  constructor() {
    const saved = localStorage.getItem('isAdmin');
    this.isAdmin$.next(saved === 'true');
  }

  logIn() {
    this.isAdmin$.next(true);
    localStorage.setItem('isAdmin', 'true');
  }

  logOut() {
    this.isAdmin$.next(false);
    localStorage.removeItem('isAdmin');
  }
}
