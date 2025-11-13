import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MangerService } from './../@services/manger.service';
import { HttpService } from '../@services/http.service';
import { ApiData, Login } from '../@interface/api-data';
import { MatDialog } from '@angular/material/dialog';
import { BasicMesComponent } from '../dialog/basic-mes/basic-mes.component';
import { DialogService } from '../@services/dialog.service';


@Component({
  selector: 'app-log-in',
  imports: [
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  constructor(
    private router: Router,
    private mangerService: MangerService,
    private httpService: HttpService,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) { }

  showPassword = false;
  account !: string;
  password !: string;

  changePasswordIcon() {
    this.showPassword = !this.showPassword;
  }

  logIn() {

    //沒有帳號密碼
    if (!this.account || !this.password) {
      this.dialogService.openDialog('錯誤訊息', '請輸入帳號密碼');
      return;
    }

    const body: Login = { account: this.account, password: this.password };

    this.httpService.postApi('quiz/login', body).subscribe({
      next: (res: ApiData) => {
        console.log(res);

        if (res.code === 200) {
          this.mangerService.logIn(); // 更新管理員狀態
          this.router.navigate(['/user-list']); // 登入成功導頁
        } else {
          this.dialogService.openDialog(
            `錯誤訊息 ${res.code}`,
            '帳號或密碼輸入錯誤!'
          );
        }
      },
      error: (err: any) => {
        console.error('API呼叫錯誤：', err);
        this.dialogService.openDialog(
          `錯誤訊息 ${err.status}`,
          '帳號密碼格式或伺服器錯誤!'
        );
      }
    });

  }
}
