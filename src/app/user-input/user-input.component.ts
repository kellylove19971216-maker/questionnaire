import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputDataService } from '../@services/input-data.service';
import { MangerService } from './../@services/manger.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../dialog/alert/alert.component';
import { Questionnaire, QuestionnaireAnswer, QuestionAnswer} from '../@interface/questionnaire.interface';

@Component({
  selector: 'app-user-input',
  imports: [FormsModule, RouterModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})
export class UserInputComponent {

  //建構
  constructor(private inputDataService: InputDataService, private router: Router, private mangerService: MangerService) { }

  //使用 Questionnaire interface
  quest: Questionnaire = {
    id: 1,
    title: 'JAVA前端課程意見回饋',
    sTime: '2025-10-25',
    eTime: '2025-12-31',
    explain: '本問卷旨在蒐集學員對 JAVA 前端課程的意見與建議,透過您的回饋,我們能更清楚了解課程內容、教材安排與授課方式的優缺點,以便未來持續改進與優化。提供更符合需求的學習體驗。您的每一份意見都非常重要,感謝您撥冗填寫!',
    city: '',
    name: '',
    phone: '',
    age: 1,
    sex: '',
    email: '',
    questArray: [
      {
        questId: 1,
        need: false,
        exist: true,
        questName: '您對本次 JAVA 前端課程的整體滿意度為何?',
        type: 'Q',
        options: [
          { optionName: '非常不滿意', code: 'A' },
          { optionName: '不滿意', code: 'B' },
          { optionName: '普通', code: 'C' },
          { optionName: '滿意', code: 'D' },
          { optionName: '非常滿意', code: 'E' },
        ],
      },
      {
        questId: 2,
        need: true,
        exist: true,
        questName: '您覺得課程的難易度如何?',
        type: 'Q',
        options: [
          { optionName: '非常簡單', code: 'A' },
          { optionName: '簡單', code: 'B' },
          { optionName: '普通', code: 'C' },
          { optionName: '困難', code: 'D' },
          { optionName: '非常困難', code: 'E' },
        ],
        optionInput: ''
      },
      {
        questId: 3,
        need: false,
        exist: true,
        questName: '您覺得本課程中最有幫助的部分是哪些?(可複選)',
        type: 'M',
        options: [
          { optionName: 'JAVA 語法基礎', code: 'A' },
          { optionName: 'JAVA與前端整合(例如 Servlet、JSP、Spring Boot 前端應用)', code: 'B' },
          { optionName: '講師的教學方式', code: 'C' },
          { optionName: '實作練習與專案', code: 'D' },
          { optionName: '前端基礎(HTML / CSS / JavaScript)', code: 'E' },
        ],
      },
      {
        questId: 4,
        need: true,
        exist: true,
        questName: '您希望未來課程可以加強哪些面向?(可複選)',
        type: 'M',
        options: [
          { optionName: '更多實作案例', code: 'A' },
          { optionName: '更深入的框架介紹(如 Vue、React、Angular 與 Java 的串接)', code: 'B' },
          { optionName: '就業實務技能(履歷、面試技巧)', code: 'C' },
          { optionName: '小組討論與互動', code: 'D' },
          { optionName: '線上教材或錄影複習', code: 'E' },
        ],
      },
      {
        questId: 5,
        need: false,
        exist: true,
        questName: '您覺得本課程最值得保留的優點是什麼?',
        type: 'T',
        options: [],
      },
      {
        questId: 6,
        need: true,
        exist: true,
        questName: '您對講師的教學方式有什麼建議或回饋?',
        type: 'T',
        options: [],
      },
    ]
  };

  // 存放使用者選擇的答案
  answerData: QuestionnaireAnswer = {
    city: '',
    name: '',
    phone: '',
    age: 0,
    sex: '',
    email: '',
    questArray: [],
    id: 0,
    title: '',
    sTime: '',
    eTime: '',
    explain: ''
  };

  isAdmin!: boolean; //管理者
  readonly dialog = inject(MatDialog); //dialog使用

  ngOnInit() {
    //判斷是否為管理者
    this.mangerService._isAdmin$.subscribe((res) => {
      this.isAdmin = res;
    });

    //判斷有沒有填過資料
    if (!this.inputDataService.answerData) {

      //題目塞進去，整理格式
      this.answerData = {
        ...this.quest,
        questArray: this.tidyQuestArray()
      };
    } else {
      //如果service有東西(管理者輸入題目或使用者點上一頁修改答案)
      this.answerData = this.inputDataService.answerData;
    }
  }


  // 【修改】整理假資料的資料格式,轉換為 QuestionAnswer 格式
  tidyQuestArray(): QuestionAnswer[] {
    return this.quest.questArray.map(array => ({
      ...array,
      textAnswer: '',
      radioAnswer: '',
      options: array.options.map(option => ({
        ...option,
        boxBollen: false
      }))
    }));
  }

  //確認使用者有沒有填寫
  checkNeed(): boolean {
    if (!this.answerData.name || !this.answerData.email || !this.answerData.phone) {
      this.dialog.open(AlertComponent, {
        data: { message: '個人資料未填寫完整!' }
      });
      return false;
    };
    for (let needs of this.answerData.questArray) {
      if (needs.need) {

        //單選
        if (needs.type == "Q" && !needs.radioAnswer) {
          this.dialog.open(AlertComponent, {
            data: { message: '單選題有漏填項目!' }
          });
          return false;
        }

        //多選
        else if (needs.type == "M") {
          let check = false;
          for (let booleans of needs.options) {
            if (booleans.boxBollen) {
              check = true;
            }
          }
          if (!check) {
            this.dialog.open(AlertComponent, {
              data: { message: '多選題有漏填項目!' }
            });
            return false;
          }
        }

        //文字題
        else if (needs.type == "T" && !needs.textAnswer) {
          this.dialog.open(AlertComponent, {
            data: { message: '開放題有漏填項目!' }
          });
          return false;
        }
      };
    }
    return true;
  }

  //使用者的下一頁
  nextStep() {
    if (this.checkNeed()) {
      this.inputDataService.answerData = this.answerData;
      this.router.navigate(['/user-confirm']);
      console.log(this.inputDataService.answerData);
    }
  }

  //管理者區域

  //存檔
  saveData() {
    this.inputDataService.answerData = null;
  }

  //公開
  publish() {
    this.inputDataService.answerData = null;
  }

  //返回管理者input
  goBack() {
    this.inputDataService.answerData = this.answerData;
  }

}
