import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputDataService } from '../@services/input-data.service';
import { MangerService } from './../@services/manger.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../dialog/alert/alert.component';
import { Questionnaire, QuestionnaireWithUser } from '../@interface/questionnaire.interface';
import { HttpService } from '../@services/http.service';
import { BasicMesComponent } from '../dialog/basic-mes/basic-mes.component';
import { DialogService } from '../@services/dialog.service';

@Component({
  selector: 'app-user-input',
  imports: [FormsModule, RouterModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})
export class UserInputComponent {

  //建構
  constructor(
    private inputDataService: InputDataService,
    private router: Router,
    private mangerService: MangerService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private dialogService: DialogService,
  ) { }

  // 存放interface資料
  answerData: QuestionnaireWithUser = {
    user:
    {
      city: '',
      name: '',
      phone: '',
      age: 1,
      sex: '',
      email: ''
    },
    quiz: {
      id: 1,
      title: '',
      startDate: '',
      endDate: '',
      description: ''
    },
    questionVoList: []
  };

  isAdmin!: boolean; //管理者

  ngOnInit() {
    // 判斷是否為管理者
    this.mangerService._isAdmin$.subscribe((res) => {
      this.isAdmin = res;
    });

    // 從 service 取問卷資料
    const data = this.inputDataService.answerData;

    if (!data) {
      // 使用共用 DialogService 開啟錯誤訊息並導頁
      this.dialogService.openDialogAndGoList('錯誤', '目前沒有問卷資料，請從問卷列表進入！');
      return;
    }

    // ✅ 有資料時直接初始化
    console.log('載入問卷資料：', data);
    this.answerData = {
      user: data.user ?? { city: '', name: '', phone: '', age: 1, sex: '', email: '' },
      quiz: data.quiz,
      questionVoList: data.questionVoList.map((q: any) => ({
        ...q,
        radioAnswer: Number(q.radioAnswer) || 0,
        textAnswer: q.textAnswer ?? ''
      }))
    };

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


  //檢查必填
  checkNeed(): boolean {
    const { user, questionVoList } = this.answerData;

    // ✅ 個人資料檢查
    if (!user.name || !user.email || !user.phone) {
      this.dialogService.alert('個人資料未填寫完整!');
      return false;
    }

    if (user.age < 1) {
      this.dialogService.alert('年齡不可小於1!');
      return false;
    }

    // ✅ 題目檢查
    for (let q of questionVoList) {
      if (!q.need) continue;

      if (q.type === 'Q' && !q.radioAnswer) {
        this.dialogService.alert('單選題有漏填項目!');
        return false;
      }

      if (q.type === 'M' && !(q.optionsList?.some(opt => opt.boxBoolean))) {
        this.dialogService.alert('多選題有漏填項目!');
        return false;
      }

      if (q.type === 'T' && !q.textAnswer) {
        this.dialogService.alert('開放題有漏填項目!');
        return false;
      }
    }

    return true;
  }

  //-----------------------使用者區域------------------------

  //預覽畫面
  nextStep() {
    if (this.checkNeed()) {
      this.inputDataService.answerData = this.answerData;
      this.router.navigate(['/user-confirm']);
      console.log(this.inputDataService.answerData);
    }
  }

  //-----------------------管理者區域------------------------

  //公開
  publish() {
    // 在送出 API 前，把 user 拿掉
    const { quiz, questionVoList } = this.answerData;
    const questionnaireToSave: Questionnaire = { quiz, questionVoList };

    // 判斷更新或新增
    const apiUrl = quiz.id > 0 ? 'quiz/update' : 'quiz/create';

    this.httpService.postApi(apiUrl, questionnaireToSave).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          console.log('問卷儲存成功',res);
          this.inputDataService.answerData = null;
          this.dialogService.openDialogAndGoList(
            '問卷已儲存',
            '於問卷開始前都可以進行修改！'
          );
        }
      },
      error: (err: any) => {
        console.error('API呼叫錯誤：', err);
        this.dialogService.openDialog(
          `錯誤訊息 ${err.status}`,
          '伺服器錯誤!'
        );
      }
    });
  }


  //返回管理者input
  goBack() {
    this.inputDataService.answerData = this.answerData;
    this.router.navigate(['/manger-input']);
  }

}
