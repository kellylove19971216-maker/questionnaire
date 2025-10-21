import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangerService {

  //本人
  private isAdmin$ = new BehaviorSubject<boolean>(false);

  //觀察者
  _isAdmin$ = this.isAdmin$.asObservable();

  constructor() {
  // 從瀏覽器的 localStorage 取得先前儲存的登入狀態
  // 如果 saved === 'true'，表示之前登入過，否則為 false
    const saved = localStorage.getItem('isAdmin');

  // 更新 BehaviorSubject 的值，初始化登入狀態
    this.isAdmin$.next(saved === 'true');
  }

  //登入
  logIn() {
    this.isAdmin$.next(true);
    localStorage.setItem('isAdmin', 'true');
  }

  //登出
  logOut() {
    this.isAdmin$.next(false);
    localStorage.removeItem('isAdmin');
  }
}
