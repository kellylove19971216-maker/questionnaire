import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MangerService } from './../@services/manger.service';
import { HttpService } from '../@services/http.service';
import { ApiData,Login } from '../@interface/api-data';
import { MatDialog } from '@angular/material/dialog';
import { BasicMesComponent } from '../dialog/basic-mes/basic-mes.component';


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
  ) { }

  showPassword = false;
  account !: string;
  password !: string;

  changePasswordIcon() {
    this.showPassword = !this.showPassword;
  }

  logIn() {

    //沒有輸入帳號或密碼
       if (!this.account || !this.password) {
      this.dialog.open(BasicMesComponent,{
            data: {
              title: '錯誤訊息',
              message: '請輸入帳號密碼'}
          });
      return;
    }

    const body: Login = { account: this.account, password: this.password };

    //串聯後端API
    this.httpService.postApi('quiz/login', body)
      .subscribe({
        next: (res: ApiData) => {
          console.log(res);

          if (res.code == 200) {
            this.mangerService.logIn(); // 更新管理員狀態
            this.router.navigate(['/user-list']); // 登入成功導頁
          } else {
            this.dialog.open(BasicMesComponent,{
            data: {
              title: '錯誤訊息'+ res.code,
              message: '帳號或密碼輸入錯誤!'} //格式對，但內容錯
          });
          }
        },
        // error呼叫Api錯誤的時候會來到這邊(可能格式就錯了)
        error: (err: any) => {
          console.error('API呼叫錯誤：', err);
          this.dialog.open(BasicMesComponent,{
            data: {
              title: '錯誤訊息'+err.status,
              message: '帳號密碼格式或伺服器錯誤!'}
          });
        }
      });
  }
}

