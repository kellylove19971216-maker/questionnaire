import { MangerService } from './../@services/manger.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputDataService } from '../@services/input-data.service';
import { Questionnaire } from '../@interface/questionnaire.interface';

@Component({
  selector: 'app-user-confirm',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-confirm.component.html',
  styleUrl: './user-confirm.component.scss'
})
export class UserConfirmComponent {
  answerData !: Questionnaire; // 存放使用者選擇的答案
  isAdmin !:boolean; //管理者狀態

  constructor(private inputDataService: InputDataService, private mangerService:MangerService) {
   }

  ngOnInit(): void {

    //將先前資料帶入確認頁面
    this.answerData = this.inputDataService.answerData;

    //判斷是否為管理者查看狀態
    this.mangerService._isAdmin$.subscribe((res) => {
    this.isAdmin=res;});
  }
  //上一頁
  goBack() {
    this.inputDataService.answerData = this.answerData;
  }

  //管理者回饋上一頁
  previewBack(){
    this.inputDataService.answerData=null;
  }

  //確認送出
  confirmOK() {
    this.inputDataService.answerData = null;
  }
}
