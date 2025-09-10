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

  constructor(private inputDataService: InputDataService) { }


  ngOnInit(): void {
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
    console.log(this.answers);
  }
  //上一頁
  goBack() {
    this.inputDataService.answerData.ageData = this.ageData;
    this.inputDataService.answerData.emailData = this.emailData;
    this.inputDataService.answerData.nameData = this.nameData;
    this.inputDataService.answerData.phoneData = this.phoneData;
    this.inputDataService.answerData.selectData = this.selectData;
    this.inputDataService.answerData.sexData = this.sexData;
    this.inputDataService.titleData = this.titleData;
    this.inputDataService.idData = this.idData;
    this.inputDataService.sTimeData = this.sTimeData;
    this.inputDataService.eTimeData = this.eTimeData;
    this.inputDataService.explainData = this.explainData;
    this.inputDataService.answers = this.answers;
  }
}
