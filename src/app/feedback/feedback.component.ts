import { Component, HostListener } from '@angular/core';
import { InputDataService } from '../@services/input-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../@services/http.service';

// 回饋列表項目
interface FeedbackItem {
  name: string;
  email: string;
  fillinDate: string;
}

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  constructor(
    private inputDataService: InputDataService,
    private httpService: HttpService,
    private router: Router,) { }

  // 回饋列表（顯示有哪些人填過問卷）
  feedbackList: FeedbackItem[] = [];
  // 當前問卷 ID（從上一頁帶入）
  currentQuizId: number = 0;
  // 問卷基本資訊
  quizInfo: any = null;
  // 載入狀態
  isLoading: boolean = false;

  //   ngOnInit(): void {
  //   // 從 service 取得當前問卷 ID
  //   this.currentQuizId = this.inputDataService.answerData.quiz.id || 0;

  //   if (this.currentQuizId > 0) {
  //     this.loadFeedbackList();
  //   } else {
  //     console.error('未取得問卷 ID');
  //     this.goBack();
  //   }
  // }

  //假回饋資料
  questArray = [
    { name: '小珈', email: 'kelly19990730@gmail.com', fillinDate: '2025-11-13' },
    { name: 'Allen', email: 'allen@example.com', fillinDate: '2025-11-02' },
    { name: '公主', email: 'princess@example.com', fillinDate: '2025-11-30' },
  ];

  //假資料+帶入確認頁面
  goPreview() {
    // ========== 假資料：使用者填寫問卷 ==========
    this.inputDataService.answerData = {
      user: {
        name: "小珈",
        phone: "0983458001",
        email: "kelly19990730@gmail.com",
        age: 18,
        sex: "女",
        city: "台北市"
      },
      quiz: {
        id: 1,
        title: 'UI/UX 設計滿意度調查',
        startDate: '2025-09-15',
        endDate: '2025-10-31',
        description: '本問卷旨在蒐集使用者對系統介面與操作體驗的意見與建議，透過您的回饋，我們能更清楚了解設計的優缺點，以便持續改進與優化，提供更佳的使用體驗。感謝您撥冗填寫！',
      },
      questionVoList: [
        {
          quizId: 1,
          questionId: 1,
          name: '您對整體 UI/UX 設計的滿意度為何？',
          type: 'Q',
          need: true,
          exist: true,
          optionsList: [
            { optionName: '非常不滿意', code: 1, boxBollean: false },
            { optionName: '不滿意', code: 2, boxBollean: false },
            { optionName: '普通', code: 3, boxBollean: false },
            { optionName: '滿意', code: 4, boxBollean: false },
            { optionName: '非常滿意', code: 5, boxBollean: false },
          ],
          radioAnswer: 4, // 使用者選擇「滿意」(code=4)
          textAnswer: '',
        },
        {
          quizId: 1,
          questionId: 2,
          name: '您覺得介面設計的清晰度與易用性如何？',
          type: 'Q',
          need: true,
          exist: true,
          optionsList: [
            { optionName: '非常差', code: 1, boxBollean: false },
            { optionName: '差', code: 2, boxBollean: false },
            { optionName: '普通', code: 3, boxBollean: false },
            { optionName: '好', code: 4, boxBollean: false },
            { optionName: '非常好', code: 5, boxBollean: false },
          ],
          radioAnswer: 5, // 使用者選擇「非常好」(code=5)
          textAnswer: '',
        },
        {
          quizId: 1,
          questionId: 3,
          name: '您覺得本系統中最有幫助或設計最好的部分是哪些？（可複選）',
          type: 'M',
          need: true,
          exist: true,
          optionsList: [
            { optionName: '介面排版與視覺設計', code: 1, boxBollean: false },
            { optionName: '操作流程與互動體驗', code: 2, boxBollean: true }, // 勾選
            { optionName: '功能完整性', code: 3, boxBollean: false },
            { optionName: '資訊呈現的清晰度', code: 4, boxBollean: true }, // 勾選
            { optionName: '響應速度與效能', code: 5, boxBollean: false },
          ],
          radioAnswer: undefined,
          textAnswer: '',
        },
        {
          quizId: 1,
          questionId: 4,
          name: '您希望未來在 UI/UX 設計上加強哪些面向？（可複選）',
          type: 'M',
          need: true,
          exist: true,
          optionsList: [
            { optionName: '更多一致性的設計風格', code: 1, boxBollean: false },
            { optionName: '更直覺的操作流程', code: 2, boxBollean: true }, // 勾選
            { optionName: '更佳的行動裝置體驗', code: 3, boxBollean: true }, // 勾選
            { optionName: '色彩與字體搭配', code: 4, boxBollean: false },
            { optionName: '輔助說明（提示文字、教學指引）', code: 5, boxBollean: true }, // 勾選
          ],
          radioAnswer: undefined,
          textAnswer: '',
        },
        {
          quizId: 1,
          questionId: 5,
          name: '您覺得目前設計中最值得保留的優點是什麼？',
          type: 'T',
          need: true,
          exist: true,
          optionsList: [],
          radioAnswer: undefined,
          textAnswer: '整體配色溫和，使用起來很舒服。',
        },
        {
          quizId: 1,
          questionId: 6,
          name: '您對 UI/UX 設計還有哪些建議或回饋？',
          type: 'T',
          need: true,
          exist: true,
          optionsList: [],
          radioAnswer: undefined,
          textAnswer: '希望在操作流程上能再更簡化，例如縮短步驟數；另外能提供新手提示，讓第一次使用的人更容易上手。',
        }
      ]
    }
    this.router.navigate(['/user-confirm']);
  }

  // ================= 載入回饋列表 =================
  // loadFeedbackList() {
  //   this.isLoading = true;
  //   this.httpService.postApi('fillin/feedback_list', { quizId: this.currentQuizId })
  //     .subscribe({
  //       next: (res: any) => {
  //         this.isLoading = false;
  //         if (res.code === 200 && res.data) {
  //           // 後端回傳格式：
  //           // {
  //           //   quiz: { id, title, startDate, endDate, description },
  //           //   feedbackList: [
  //           //     { name: "小珈", email: "kelly@gmail.com", fillinDate: "2025-11-13" },
  //           //     { name: "Allen", email: "allen@gmail.com", fillinDate: "2025-11-02" }
  //           //   ]
  //           // }
  //           this.quizInfo = res.data.quiz;
  //           this.feedbackList = res.data.feedbackList || [];
  //         } else {
  //           console.error('取得回饋列表失敗', res);
  //           alert('取得回饋列表失敗');
  //         }
  //       },
  //       error: (err: any) => {
  //         this.isLoading = false;
  //         console.error('API 呼叫錯誤：', err);
  //         alert('載入失敗，請稍後再試');
  //       }
  //     });
  // }

  // ================= 查看單一使用者的回饋 =================
  // viewFeedback(item: FeedbackItem) {
  //   this.isLoading = true;

  //   // 呼叫後端 API 取得該使用者的完整答案
  //   this.httpService.postApi('fillin/detail', {
  //     quizId: this.currentQuizId,
  //     email: item.email
  //   })
  //     .subscribe({
  //       next: (res: any) => {
  //         this.isLoading = false;
  //         if (res.code === 200 && res.data) {
  //           // 後端回傳格式：
  //           // {
  //           //   user: { name, phone, email, age, sex, city },
  //           //   quiz: { id, title, startDate, endDate, description },
  //           //   questionVoList: [
  //           //     { quizId, questionId, name, type, need, exist, optionsList },
  //           //     ...
  //           //   ],
  //           //   fillinList: [
  //           //     { quizId, questionId, email, answerStr, fillinDate },
  //           //     ...
  //           //   ]
  //           // }

  //           // 組合完整資料
  //           const answerData = {
  //             user: res.data.user,
  //             quiz: res.data.quiz,
  //             questionVoList: res.data.questionVoList.map((q: any) => {
  //               // 找到對應的答案
  //               const fillin = res.data.fillinList.find(
  //                 (f: any) => f.questionId === q.questionId
  //               );

  //               // 將 answerStr 轉換回前端格式
  //               if (fillin) {
  //                 parseAnswerFromString(q, fillin.answerStr);
  //               }

  //               return q;
  //             })
  //           };

  //           this.inputDataService.answerData = answerData;
  //           this.router.navigate(['/user-confirm']);
  //         } else {
  //           console.error('取得回饋詳情失敗', res);
  //           alert('取得回饋詳情失敗');
  //         }
  //       },
  //       error: (err: any) => {
  //         this.isLoading = false;
  //         console.error('API 呼叫錯誤：', err);
  //         alert('載入失敗，請稍後再試');
  //       }
  //     });
  // }


  //返回上一頁
  goBack() {
    this.router.navigate(['/user-list']);
  }
  //查看統計
  goStatistics() {
    this.router.navigate(['/user-statistics']);
  }

  //監聽瀏覽器後退
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // 清空 answerData
    this.inputDataService.answerData = null;
  }
}
