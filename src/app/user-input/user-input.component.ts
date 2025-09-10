import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputDataService } from '../@services/input-data.service';

@Component({
  selector: 'app-user-input',
  imports: [FormsModule, RouterModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})
export class UserInputComponent {
  constructor(private inputDataService: InputDataService) { }
  quest = {
    id: 1,
    title: 'JAVA前端課程意見回饋',
    sTime: '2025-10-25',
    eTime: '2025-12-31',
    explain: '本問卷旨在蒐集學員對 JAVA 前端課程的意見與建議，透過您的回饋，我們能更清楚了解課程內容、教材安排與授課方式的優缺點，以便未來持續改進與優化。提供更符合需求的學習體驗。您的每一份意見都非常重要，感謝您撥冗填寫！',
    questArray: [
      {
        questId: 1,
        need: true,
        exist: true,
        questName: '您對本次 JAVA 前端課程的整體滿意度為何？',
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
        questName: '您覺得課程的難易度如何？',
        type: 'Q',
        options: [
          { optionName: '非常簡單', code: 'A' },
          { optionName: '簡單', code: 'B' },
          { optionName: '普通', code: 'C' },
          { optionName: '困難', code: 'D' },
          { optionName: '非常困難', code: 'E' },
        ],
        optionInput: []
      },
      {
        questId: 3,
        need: true,
        exist: true,
        questName: '您覺得本課程中最有幫助的部分是哪些？（可複選）',
        type: 'M',
        options: [
          { optionName: 'JAVA 語法基礎', code: 'A' },
          { optionName: 'JAVA與前端整合（例如 Servlet、JSP、Spring Boot 前端應用）', code: 'B' },
          { optionName: '講師的教學方式', code: 'C' },
          { optionName: '實作練習與專案', code: 'D' },
          { optionName: '前端基礎（HTML / CSS / JavaScript）', code: 'E' },
        ],
      },
      {
        questId: 4,
        need: true,
        exist: true,
        questName: '您希望未來課程可以加強哪些面向？（可複選）',
        type: 'M',
        options: [
          { optionName: '更多實作案例', code: 'A' },
          { optionName: '更深入的框架介紹（如 Vue、React、Angular 與 Java 的串接）', code: 'B' },
          { optionName: '就業實務技能（履歷、面試技巧）', code: 'C' },
          { optionName: '小組討論與互動', code: 'D' },
          { optionName: '線上教材或錄影複習', code: 'E' },
        ],
      },
      {
        questId: 5,
        need: true,
        exist: true,
        questName: '您覺得本課程最值得保留的優點是什麼？',
        type: 'T',
        options: [],
      },
      {
        questId: 6,
        need: true,
        exist: true,
        questName: '您對講師的教學方式有什麼建議或回饋？',
        type: 'T',
        options: [],
      },
    ]
  };
  selectData: string = '';
  nameData: string = '';
  phoneData: string = '';
  emailData: string = '';
  ageData: number = 0;
  sexData: string = '';
  answers: any[] = [];  // 存放使用者選擇的答案
  radioAnswer: string = ''; //單選答案
  textanswer: string = ''; //文字答案
  boxBollen !: boolean; //多選判斷
  idData !: number;
  titleData: string = '';
  sTimeData: string = '';
  eTimeData: string = '';
  explainData: string = '';

  ngOnInit() {
    this.idData = this.quest.id;
    this.titleData = this.quest.title;
    this.sTimeData = this.quest.sTime;
    this.eTimeData = this.quest.eTime;
    this.explainData = this.quest.explain;
    //判斷有沒有填過資料，如果沒有就帶入方法
    if(!this.inputDataService.answers){
    this.tidyQuestArray();
    }else{
    //如果有傳東西回來
    this.ageData = this.inputDataService.answerData.ageData;
    this.emailData = this.inputDataService.answerData.emailData;
    this.nameData = this.inputDataService.answerData.nameData;
    this.phoneData = this.inputDataService.answerData.phoneData;
    this.selectData = this.inputDataService.answerData.selectData;
    this.sexData = this.inputDataService.answerData.sexData;
    this.titleData = this.inputDataService.titleData;
    this.idData = this.inputDataService.idData;
    this.sTimeData = this.inputDataService.sTimeData;
    this.eTimeData = this.inputDataService.eTimeData;
    this.explainData = this.inputDataService.explainData;
    this.answers = this.inputDataService.answers;
    }
  }

  //整理假資料的資料格式
  tidyQuestArray() {
    //單選.文字
    for (let array of this.quest.questArray) {
      this.answers.push({ ...array, textAnswer: '', radioAnswer: '' })
    }
    //多選
    for (let newArray of this.answers) {
      let options = [];
      for (let option of newArray.options) {
        options.push({ ...option, boxBollen: false })
      }
      //設一個新陣列選項取代原本的選項
      newArray.options = options;
    }
    console.log(this.answers);

  }

  nextStep() {
    this.inputDataService.answerData = {
      selectData: this.selectData,
      nameData: this.nameData,
      phoneData: this.phoneData,
      ageData: this.ageData,
      sexData: this.sexData,
      emailData: this.emailData,
    }
    this.inputDataService.answers = this.answers;
    this.inputDataService.idData = this.idData;
    this.inputDataService.titleData = this.titleData;
    this.inputDataService.sTimeData = this.sTimeData;
    this.inputDataService.eTimeData = this.eTimeData;
    this.inputDataService.explainData = this.explainData;
  }
}
