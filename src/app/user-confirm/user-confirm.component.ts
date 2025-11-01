import { MangerService } from './../@services/manger.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputDataService } from '../@services/input-data.service';
import { QuestionnaireWithUser } from '../@interface/questionnaire.interface';

@Component({
  selector: 'app-user-confirm',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-confirm.component.html',
  styleUrl: './user-confirm.component.scss'
})
export class UserConfirmComponent {
  answerData !: QuestionnaireWithUser; // 存放使用者選擇的答案
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

  // ========== 提交問卷時的處理 ==========
// 使用方式範例：
/*
import { prepareFillinData } from './questionnaire.interface';

submitQuestionnaire() {
  // 1. 準備提交資料
  const fillinList = prepareFillinData(this.inputDataService.answerData);

  // fillinList 結果會是：
  // [
  //   { quizId: 1, questionId: 1, email: "kelly19990730@gmail.com", answerStr: "4", fillinDate: "2025-11-01" },
  //   { quizId: 1, questionId: 2, email: "kelly19990730@gmail.com", answerStr: "5", fillinDate: "2025-11-01" },
  //   { quizId: 1, questionId: 3, email: "kelly19990730@gmail.com", answerStr: "2,4", fillinDate: "2025-11-01" },
  //   { quizId: 1, questionId: 4, email: "kelly19990730@gmail.com", answerStr: "2,3,5", fillinDate: "2025-11-01" },
  //   { quizId: 1, questionId: 5, email: "kelly19990730@gmail.com", answerStr: "整體配色溫和，使用起來很舒服。", fillinDate: "2025-11-01" },
  //   { quizId: 1, questionId: 6, email: "kelly19990730@gmail.com", answerStr: "希望在操作流程上能再更簡化...", fillinDate: "2025-11-01" }
  // ]

  // 2. 呼叫後端 API
  this.httpService.postApi('fillin/submit', { fillinList })
    .subscribe({
      next: (res) => {
        console.log('提交成功', res);
      },
      error: (err) => {
        console.error('提交失敗', err);
      }
    });
}
*/
}
