import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputDataService } from '../@services/input-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AlertComponent } from '../dialog/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Question, Questionnaire, QuestionnaireWithUser } from '../@interface/questionnaire.interface';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-manger-input',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './manger-input.component.html',
  styleUrl: './manger-input.component.scss'
})
export class MangerInputComponent {

  //interface 設立問卷變數
  questionnaire: Questionnaire = {
    quiz: {
      id: 0,
      title: '',
      startDate: '',
      endDate: '',
      description: ''
    },
    questionVoList: []
  };

  today!: string;

  constructor(
    private inputDataService: InputDataService,
    private router: Router,
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    //最小值為今天
    const t = new Date();
    this.today = t.toISOString().split('T')[0]; // 直接取 YYYY-MM-DD

    //修改中的問卷
    if (this.inputDataService.answerData) {
      // 確保 answerData 有完整結構
      if (this.inputDataService.answerData.quiz) {
        this.questionnaire.quiz = { ...this.inputDataService.answerData.quiz };
      }
      if (this.inputDataService.answerData.questionVoList) {
        this.questionnaire.questionVoList = [...this.inputDataService.answerData.questionVoList];
      }
      console.log('載入問卷資料：', this.questionnaire);
    }
  }


  //新增問題
  addQuestion() {
    let newId = this.questionnaire.questionVoList.length + 1; // 依陣列長度決定 questionId
    this.questionnaire.questionVoList.push({
      quizId: this.questionnaire.quiz.id,
      questionId: newId,
      type: 'Q',
      name: '',
      exist: true,
      need: true,
      optionsList: []
    });
  }


  //刪除問題
  removeQuestion(index: number) {
    this.questionnaire.questionVoList.splice(index, 1);

    // 重新排序剩下題目的 questionId
    this.questionnaire.questionVoList.forEach((question, i) => {
      question.questionId = i + 1;
    });
  }

  //新增選項
  addOption(question: Question) {
    let nextCode = question.optionsList.length + 1; // 隨選項增加 1.2.3.4
    question.optionsList.push({
      optionName: '',
      code: nextCode,
    });
  }

  //刪除選項
  removeOption(question: Question, optionIndex: number) {
    question.optionsList.splice(optionIndex, 1);
    // 重新排序剩下的選項 code 為 1, 2, 3...
    question.optionsList.forEach((option, index) => {
      option.code = index + 1;
    });
  }


  //確認開的問題都有寫
  checkDone(): boolean {

    // 問卷資料
    if (!this.questionnaire.quiz.title || !this.questionnaire.quiz.startDate || !this.questionnaire.quiz.endDate || !this.questionnaire.quiz.description) {
      this.dialog.open(AlertComponent, {
        data: { message: '問卷基本資訊不能為空!' }
      });
      return false;
    };

    // 檢查是否至少有一題
    if (!this.questionnaire.questionVoList || this.questionnaire.questionVoList.length === 0) {
      this.dialog.open(AlertComponent, {
        data: { message: '請至少新增一個問題!' }
      });
      return false;
    }

    // 題目內部
    for (let need of this.questionnaire.questionVoList) {

      //題目名稱不可空
      if (!need.name) {
        this.dialog.open(AlertComponent, {
          data: { message: '題目不能為空!' }
        });
        return false;
      }

      // 非文字題必須有至少兩個選項
      if (need.type !== 'T') {
        if (!need.optionsList || need.optionsList.length < 2) {
          this.dialog.open(AlertComponent, {
            data: { message: '一個題目至少需要兩個選項!' }
          });
          return false;
        }
      }

      //選項名稱不可空
      for (let opt of need.optionsList) {
        if (!opt.optionName) {
          this.dialog.open(AlertComponent, {
            data: { message: '選項內容不能為空!' }
          });
          return false;
        }
      }

      // ✅ 檢查每種題型至少要有一題
      const hasSingle = this.questionnaire.questionVoList.some(q => q.type === 'Q');
      const hasMulti = this.questionnaire.questionVoList.some(q => q.type === 'M');
      const hasText = this.questionnaire.questionVoList.some(q => q.type === 'T');

      if (!hasSingle || !hasMulti || !hasText) {
        this.dialog.open(AlertComponent, {
          data: { message: '每種題型請至少新增一題！' }
        });
        return false;
      }

    }
    return true;
  }


  //下一頁預覽問卷
  saveQuestionnaire() {
    if (this.checkDone()) {
      //整合成預覽用問卷格式
      const questionnaireForPreview: QuestionnaireWithUser = {
        user: {
          city: '',
          name: '',
          phone: '',
          age: 0,
          sex: '',
          email: ''
        },
        quiz: this.questionnaire.quiz,
        questionVoList: this.questionnaire.questionVoList
      };
      this.inputDataService.answerData = questionnaireForPreview;
      this.router.navigate(['/user-input']);
    }
  }


  //上一頁
  goback() {
    this.inputDataService.answerData = null;
    this.router.navigate(['/user-list']);
  }

  //監聽瀏覽器後退
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // 清空 answerData
    this.inputDataService.answerData = null;
  }
}
