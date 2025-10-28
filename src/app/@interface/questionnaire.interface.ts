// 選項
export interface Option {
  optionName: string;  // 選項文字
  code?: number;       // 選項代碼（可選）
  boxBollean ?:boolean; // 是否勾選 (多選)
}

// 單題（問卷題目）
export interface Question {
  type: 'Q' | 'M' | 'T';  // 題目類型：Q=單選, M=多選, T=文字
  questId: number;         // 題目編號
  need: boolean;           // 是否必填
  exist: boolean;          // 是否存在（可用於刪除或隱藏）
  questName: string;       // 題目名稱
  options: Option[];       // 選項列表
  textAnswer ?: string;    // 文字題答案
  radioAnswer ?: number;   // 單選題答案
}

// 整份問卷（原始題目）
export interface Questionnaire {
  city: string;
  name: string;
  phone: string;
  age: number;
  sex: string;
  email: string;
  id: number;
  title: string;
  sTime: string;           // 開始時間
  eTime: string;           // 結束時間
  explain: string;         // 問卷說明
  questArray: Question[];  // 題目列表
}
