// 選項
export interface Option {
  optionName: string;  // 選項文字
  code?: string;       // 選項代碼（可選）
}

// 單題（問卷題目）
export interface Question {
  type: 'Q' | 'M' | 'T';  // 題目類型：Q=單選, M=多選, T=文字
  questId: number;         // 題目編號
  need: boolean;           // 是否必填
  exist: boolean;          // 是否存在（可用於刪除或隱藏）
  questName: string;       // 題目名稱
  options: Option[];       // 選項列表
  optionInput?: string;    // 臨時輸入（新增選項用）
}

// 整份問卷（原始題目）
export interface Questionnaire {
  city: string;
  name: string;
  phone: string;
  age: number;
  sex: string;
  email: string;
  questArray: Question[];  // 題目列表
  id: number;
  title: string;
  sTime: string;           // 開始時間
  eTime: string;           // 結束時間
  explain: string;         // 問卷說明
}

// 選項回答狀態（多選題專用）
export interface OptionAnswer extends Option {
  boxBollen: boolean; // 是否勾選
}

// 單題回答資料（包含使用者輸入的答案）
export interface QuestionAnswer extends Question {
  textAnswer: string;           // 文字題答案
  radioAnswer: string;          // 單選題答案
  options: OptionAnswer[];      // 覆蓋原本選項，帶多選勾選狀態
}

// 整份問卷的使用者回答資料
export interface QuestionnaireAnswer {
  city: string;
  name: string;
  phone: string;
  age: number;
  sex: string;
  email: string;
  questArray: QuestionAnswer[]; // 題目回答列表
  id: number;
  title: string;
  sTime: string;
  eTime: string;
  explain: string;
}
