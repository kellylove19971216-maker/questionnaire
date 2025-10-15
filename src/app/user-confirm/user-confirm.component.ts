import { MangerService } from './../@services/manger.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputDataService } from '../@services/input-data.service';

@Component({
  selector: 'app-user-confirm',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-confirm.component.html',
  styleUrl: './user-confirm.component.scss'
})
export class UserConfirmComponent {
  cityData: string = '';
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
  isAdmin !:boolean; //管理者狀態

  constructor(private inputDataService: InputDataService, private mangerService:MangerService) { }


  ngOnInit(): void {
    //判斷是否為管理者查看狀態
    this.mangerService._isAdmin$.subscribe((res) => {
    this.isAdmin=res;});
    //
    this.ageData = this.inputDataService.answerData.age;
    this.emailData = this.inputDataService.answerData.email;
    this.nameData = this.inputDataService.answerData.name;
    this.phoneData = this.inputDataService.answerData.phone;
    this.cityData = this.inputDataService.answerData.city;
    this.sexData = this.inputDataService.answerData.sex;
    this.titleData = this.inputDataService.answerData.title;
    this.idData = this.inputDataService.answerData.id;
    this.sTimeData = this.inputDataService.answerData.sTime;
    this.eTimeData = this.inputDataService.answerData.eTime;
    this.explainData = this.inputDataService.answerData.explain;
    this.answers = this.inputDataService.answerData.questArray;
  }
  //上一頁
  goBack() {
    this.inputDataService.answerData.age = this.ageData;
    this.inputDataService.answerData.email = this.emailData;
    this.inputDataService.answerData.name = this.nameData;
    this.inputDataService.answerData.phone = this.phoneData;
    this.inputDataService.answerData.city = this.cityData;
    this.inputDataService.answerData.sex = this.sexData;
    this.inputDataService.answerData.title = this.titleData;
    this.inputDataService.answerData.id = this.idData;
    this.inputDataService.answerData.sTime = this.sTimeData;
    this.inputDataService.answerData.eTime = this.eTimeData;
    this.inputDataService.answerData.explain = this.explainData;
    this.inputDataService.answerData.questArray = this.answers;
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
