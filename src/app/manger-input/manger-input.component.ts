import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputDataService } from '../@services/input-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AlertComponent } from '../dialog/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Questionnaire, Question} from '../@interface/questionnaire.interface';
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
    city: '',
    name: '',
    phone: '',
    age: 0,
    sex: '',
    email: '',
    id: 1,
    title: '',
    sTime: '',
    eTime: '',
    explain: '',
    questArray: []
  };

  today!: string;
  readonly dialog = inject(MatDialog);//dialog使用

  constructor(
    private inputDataService: InputDataService,
    private router: Router,) { }


  ngOnInit(): void {
    //最小值為今天
    const t = new Date();
    this.today = t.toISOString().split('T')[0]; // 直接取 YYYY-MM-DD
    //修改中的問卷
    this.questionnaire.age = this.inputDataService.answerData.age;
    this.questionnaire.email = this.inputDataService.answerData.email;
    this.questionnaire.name = this.inputDataService.answerData.name;
    this.questionnaire.phone = this.inputDataService.answerData.phone;
    this.questionnaire.city = this.inputDataService.answerData.city;
    this.questionnaire.sex = this.inputDataService.answerData.sex;
    this.questionnaire.title = this.inputDataService.answerData.title;
    this.questionnaire.id = this.inputDataService.answerData.id;
    this.questionnaire.sTime = this.inputDataService.answerData.sTime;
    this.questionnaire.eTime = this.inputDataService.answerData.eTime;
    this.questionnaire.explain = this.inputDataService.answerData.explain;
    this.questionnaire.questArray = this.inputDataService.answerData.questArray;
  }

  //新增問題
  addQuestion() {
    let newId = this.questionnaire.questArray.length + 1; // 依陣列長度決定 questId
    this.questionnaire.questArray.push({
      questId: newId,
      type: 'Q',
      questName: '',
      exist: true,
      need: true,
      options: []
    });
  }


  //刪除問題
  removeQuestion(index: number) {
    this.questionnaire.questArray.splice(index, 1);

    // 重新排序剩下題目的 questId
    this.questionnaire.questArray.forEach((question, i) => {
      question.questId = i + 1;
    });
  }

  //新增選項
  addOption(question: Question) {
    let nextCode = String.fromCharCode(65 + question.options.length); // 隨選項增加 A, B, C...
    question.options.push({
      optionName: '',
      code: nextCode,
    });
  }

  //刪除選項
  removeOption(question: Question, optionIndex: number) {
    question.options.splice(optionIndex, 1);
    // 重新排序剩下的選項 code
    question.options.forEach((option, index) => {
      option.code = String.fromCharCode(65 + index);
    });
  }


  //確認開的問題都有寫
  checkDone(): boolean {

    // 問卷資料
    if (!this.questionnaire.title || !this.questionnaire.sTime || !this.questionnaire.eTime || !this.questionnaire.explain) {
      this.dialog.open(AlertComponent, {
        data: { message: '問卷基本資訊不能為空!' }
      });
      return false;
    };

    // 檢查是否至少有一題
    if (!this.questionnaire.questArray || this.questionnaire.questArray.length === 0) {
      this.dialog.open(AlertComponent, {
        data: { message: '請至少新增一個問題!' }
      });
      return false;
    }

    // 題目內部
    for (let need of this.questionnaire.questArray) {

      //題目名稱不可空
      if (!need.questName) {
        this.dialog.open(AlertComponent, {
          data: { message: '題目不能為空!' }
        });
        return false;
      }

      // 非文字題必須有至少一個選項
      if (need.type !== 'T') {
        if (!need.options || need.options.length === 0) {
          this.dialog.open(AlertComponent, {
            data: { message: `題目 "${need.questName}" 至少需要一個選項!` }
          });
          return false;
        }
      }

      //選項名稱不可空
      for (let opt of need.options) {
        if (!opt.optionName) {
          this.dialog.open(AlertComponent, {
            data: { message: '選項內容不能為空!' }
          });
          return false;
        }
      }
    }
    return true;
  }


  //下一頁預覽問卷
  saveQuestionnaire() {
    if (this.checkDone()) {
      this.inputDataService.answerData = {
        city: '',
        name: '',
        phone: '',
        age: 0,
        sex: '',
        email: '',
        questArray: this.questionnaire.questArray, // 帶題目
        id: this.questionnaire.id,
        title: this.questionnaire.title,
        sTime: this.questionnaire.sTime,
        eTime: this.questionnaire.eTime,
        explain: this.questionnaire.explain,
      };
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
