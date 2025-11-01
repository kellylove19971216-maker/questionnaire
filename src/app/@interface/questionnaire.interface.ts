// 選項
export interface Option {
  optionName: string;  // 選項文字
  code: number;       // 選項代碼
  boxBollean ?:boolean; // +是否勾選不一定顯示
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
  answerStr?: string; // 後端傳回來的資料
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

// 提交答案用
export interface QuestionnaireWithUser extends BaseQuestionnaire {
  user: User;
}

// 提交答案請求格式
export interface FillinRequest {
  quizId: number;
  questionId: number;
  email: string;          // 從 user.email 取得
  answerStr: string;      // 前端答案轉成字串
  fillinDate: string;     // LocalDate 格式 (YYYY-MM-DD)
}


// ========== 轉換函式：前端答案 → 後端 answerStr ==========
export function convertAnswerToString(question: Question): string {
  switch (question.type) {
    case 'Q': // 單選題
      // answerStr = "3" (選項的 code)
      return question.radioAnswer ? question.radioAnswer.toString() : '';

    case 'M': // 多選題
      // answerStr = "2,4" (勾選選項的 code，逗號分隔)
      const selectedCodes = question.optionsList
        .filter(opt => opt.boxBollean)
        .map(opt => opt.code)
        .sort((a, b) => a - b);
      return selectedCodes.join(',');

    case 'T': // 文字題
      // answerStr = "使用者輸入的文字"
      return question.textAnswer || '';

    default:
      return '';
  }
}

// ========== 轉換函式：後端 answerStr → 前端答案 ==========
export function parseAnswerFromString(question: Question, answerStr: string): void {
  if (!answerStr) return;

  switch (question.type) {
    case 'Q': // 單選題
      question.radioAnswer = parseInt(answerStr);
      break;

    case 'M': // 多選題
      const selectedCodes = answerStr.split(',').map(s => parseInt(s.trim()));
      question.optionsList.forEach(opt => {
        opt.boxBollean = selectedCodes.includes(opt.code);
      });
      break;

    case 'T': // 文字題
      question.textAnswer = answerStr;
      break;
  }
}

// ========== 提交問卷答案 ==========
export function prepareFillinData(
  questionnaire: QuestionnaireWithUser
): FillinRequest[] {
  const fillinList: FillinRequest[] = [];
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  questionnaire.questionVoList.forEach(question => {
    fillinList.push({
      quizId: question.quizId,
      questionId: question.questionId,
      email: questionnaire.user.email,
      answerStr: convertAnswerToString(question),
      fillinDate: today
    });
  });

  return fillinList;
}
