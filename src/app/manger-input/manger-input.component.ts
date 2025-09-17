import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputDataService } from '../@services/input-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


interface Option {
  optionName: string; // 選項文字
  code?: string;      // 選項代碼（可選）
}

interface questArray {
  type: 'Q' | 'M' | 'T';  //題目類型
  questId: number;        // 題目編號
  need: boolean;          // 是否必填
  exist: boolean;         // 是否存在
  questName: string;      // 題目名稱
  options: Option[];      //選項
  optionInput?: string;   // 用於新增選項的臨時輸入
}

interface Questionnaire {
  city: string;
  name: string;
  phone: string;
  age: number;
  sex: string;
  email: string;
  questArray: questArray[]; // 每題的答案
  id: number;
  title: string;
  sTime: string;
  eTime: string;
  explain: string;
}

@Component({
  selector: 'app-manger-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './manger-input.component.html',
  styleUrl: './manger-input.component.scss'
})
export class MangerInputComponent {


  today!: string;


  constructor(private inputDataService: InputDataService, private router: Router,) { }


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
    console.log(this.inputDataService.answerData.title);
  }


  //設立問卷變數
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
  addOption(question: questArray) {
    let nextCode = String.fromCharCode(65 + question.options.length); //隨選項增加abcd
    question.options.push({
      optionName: '',
      code: nextCode,
    });
  }


  //刪除選項
  removeOption(question: questArray, optionIndex: number) {
    question.options.splice(optionIndex, 1);
    // 重新排序剩下的選項 code
    question.options.forEach((option, index) => {
      option.code = String.fromCharCode(65 + index);
    });
  }


  //確認開的問題都有寫
  checkDone(): boolean {
    if (!this.questionnaire.title || !this.questionnaire.sTime || !this.questionnaire.eTime || !this.questionnaire.explain) {
      alert("問卷基本資訊不能為空")
      return false;
    };
    for (let need of this.questionnaire.questArray) {
      if (!need.questName) {
        alert("問題名稱不能為空")
        return false;
      }
      for (let opt of need.options) {
        if (!opt.optionName) {
          alert("選項名稱不能為空")
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
}
