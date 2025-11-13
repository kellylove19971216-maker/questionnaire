import { MangerService } from './../@services/manger.service';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputDataService } from '../@services/input-data.service';
import { Answer, FillinRequest, QuestionnaireWithUser } from '../@interface/questionnaire.interface';
import { HttpService } from '../@services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { BasicMesComponent } from '../dialog/basic-mes/basic-mes.component';
import { DialogService } from '../@services/dialog.service';


@Component({
  selector: 'app-user-confirm',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-confirm.component.html',
  styleUrl: './user-confirm.component.scss'
})
export class UserConfirmComponent {
  answerData !: QuestionnaireWithUser; // 存放使用者選擇的答案
  isAdmin !: boolean; //管理者狀態

  constructor(
    private router: Router,
    private inputDataService: InputDataService,
    private mangerService: MangerService,
    private httpService: HttpService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {

    //將先前資料帶入確認頁面
    this.answerData = this.inputDataService.answerData;

    //判斷是否為管理者查看狀態
    this.mangerService._isAdmin$.subscribe((res) => {
      this.isAdmin = res;
    });

// 依照題型排序後重新加上 displayId
  const sorted = [
    ...this.answerData.questionVoList.filter(q => q.type === 'Q'),
    ...this.answerData.questionVoList.filter(q => q.type === 'M'),
    ...this.answerData.questionVoList.filter(q => q.type === 'T')
  ];

  sorted.forEach((q, index) => {
    q.displayId = index + 1;
  });

  // 再指定回去
  this.answerData.questionVoList = sorted;

  }

  //上一頁
  goBack() {
    this.inputDataService.answerData = this.answerData;
  }

  //管理者查看回饋的上一頁
  previewBack() {
    this.inputDataService.answerData = this.answerData;
  }

  // 轉換函式：將前端格式轉換成後端 FillinRequest 格式
  ToFillinReq(answerData: any): FillinRequest {
    const answerList: Answer[] = [];

    for (let i = 0; i < answerData.questionVoList.length; i++) {
      const q = answerData.questionVoList[i];

      const options: any[] = [];
      if (q.optionsList && Array.isArray(q.optionsList)) {
        for (let j = 0; j < q.optionsList.length; j++) {
          const opt = q.optionsList[j];
          options.push({
            code: opt.code,
            optionName: opt.optionName,
            boxBoolean: !!opt.boxBoolean, // 確保是 true / false
          });
        }
      }

      const answer: Answer = {
        questionId: q.questionId,
        radioAnswer: q.type === 'Q' ? Number(q.radioAnswer) : 0,
        textAnswer: q.textAnswer ?? '',
        optionsList: options,
      };

      answerList.push(answer);
    }

    return {
      user: answerData.user,
      quizId: answerData.quiz.id,
      answerList,
    };
  }


  //送出問卷
  submitQuestionnaire() {
    const fillinRequest = this.ToFillinReq(this.answerData);
    console.log('轉換後的資料:', fillinRequest);

    this.httpService.postApi('quiz/fillin', fillinRequest).subscribe({
      next: (res: any) => {
        console.log('✅ API 回應:', res);
        const success = res?.code === 200 || res === 200;

        if (success) {
          this.inputDataService.answerData = null;
          this.dialogService.openDialogAndGoList('問卷已提交', '感謝填寫！');
        } else {
          console.warn('⚠️ 非預期的回應:', res);
          this.dialogService.openDialogAndGoList('提交異常', '回應格式異常');
        }
      },
      error: (err: any) => {
        console.error('❌ API 錯誤:', err);
        this.dialogService.openDialogAndGoList('提交失敗', '請確認輸入資料無誤後再試一次');
      }
    });
  }
}
