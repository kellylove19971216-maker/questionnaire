import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BasicMesComponent } from '../dialog/basic-mes/basic-mes.component';
import { AlertComponent } from '../dialog/alert/alert.component';

@Injectable({
  providedIn: 'root'
})

export class DialogService {
  constructor(private dialog: MatDialog, private router: Router) {}


  /**
   * 開啟一般訊息 Dialog
   */
  openDialog(title: string, message: string) {
    return this.dialog.open(BasicMesComponent, { data: { title, message } });
  }

  /**
   * 開啟訊息 Dialog 後導頁
   */
  openDialogAndGoList(title: string, message: string, route: string = '/user-list') {
    this.openDialog(title, message)
      .afterClosed()
      .subscribe(() => this.router.navigate([route]));
  }

  /**
   * 開啟簡單 alert（只有一個關閉按鈕）
   */
  alert(message: string) {
    return this.dialog.open(AlertComponent, { data: { message } });
  }

  /**
   * 開啟 alert 並導頁
   */
  alertAndGo(message: string, route: string = '/user-list') {
    this.alert(message)
      .afterClosed()
      .subscribe(() => this.router.navigate([route]));
  }
}



