import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputDataService {
  answerData = {
    selectData: '',
    nameData: '',
    phoneData: '',
    emailData: '',
    ageData: 0,
    sexData: '',
  };
  answers!: any;
  idData !: number;
  titleData: string = '';
  sTimeData: string = '';
  eTimeData: string = '';
  explainData: string = '';
}
