// 選項
export interface Option {
  optionName: string;  // 選項文字
  code: number;       // 選項代碼
  boxBoolean ?:boolean; // +是否勾選不一定顯示
}

// 問卷題目 + 答案不一定顯示
export interface Question {
  quizId: number;          // 問卷 id（對應後端 quizId）
  questionId: number;      // 問題 id（對應後端 questionId）
  name: string;            // 題目名稱（對應後端 name）
  type: string;            // 題目類型：Q=單選, M=多選, T=文字
  need: boolean;           // 是否必填
  exist: boolean;          // 是否存在
  optionsList: Option[];   // 選項列表（對應後端 optionsList）
  // 使用者答案部分
  textAnswer ?: string;    // 文字題答案
  radioAnswer ?: number;   // 單選題答案
  displayId ?: number; // 顯示用 ID
}

// 問卷基本資訊
export interface Quiz {
  id: number;              // 問卷ID
  title: string;           // 問卷名稱
  startDate: string;           // 開始時間
  endDate: string;           // 結束時間
  description: string;         // 問卷說明
}

// 問卷基本結構
export interface BaseQuestionnaire {
  quiz: Quiz;
  questionVoList: Question[];
}

//完整問卷
export interface Questionnaire extends BaseQuestionnaire {
}

// 使用者資料
export interface User {
  phone: string;
  name: string;
  email: string;
  age: number;
  city: string;
  sex: string;
}

// 載入使用者填寫答案頁面使用
export interface QuestionnaireWithUser extends BaseQuestionnaire {
  user: User;
  fillinDate ?: string;     // 填寫日期
}

// ==================== 答案格式（提交用）====================
export interface Answer {
  questionId: number;
  textAnswer: string;
  radioAnswer: number;
  optionsList: Option[];
}


// 提交答案請求格式
export interface FillinRequest {
  user: User;
  quizId: number;
  answerList: Answer[];          // 答案列表
}
