import { Component, HostListener } from '@angular/core';
import { InputDataService } from '../@services/input-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../@services/http.service';
import { DialogService } from '../@services/dialog.service';

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
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) { }

  feedbackList: FeedbackItem[] = [];
  currentQuizId: number = 0;
  isLoading = false;
  // 回饋資料陣列
  questArray: any[] = [];


  ngOnInit(): void {
    // 優先從 answerData 取得 quizId
    if (this.inputDataService.answerData?.quiz?.id) {
      this.currentQuizId = this.inputDataService.answerData.quiz.id;
      this.getFeedback(this.currentQuizId);
    }
    // 如果 answerData 沒有，從 URL queryParams 取得
    else {
      this.route.queryParams.subscribe(params => {
        const quizId = Number(params['quizId']);
        if (quizId > 0) {
          this.currentQuizId = quizId;
          this.getFeedback(quizId);
        } else {
          this.dialogService.alert('缺少問卷 ID');
          this.router.navigate(['/user-list']);
        }
      });
    }
  }

  // 從後端取得資料
  getFeedback(quizId: number) {
    this.isLoading = true;
    this.httpService.getFeedbackApi('quiz/feedback', { quizId }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.code === 200 && res.feedbackVo) {
          // 把完整資料存起來（之後詳細檢視用）
          this.questArray = res.feedbackVo;

          // 取出顯示用的簡略資訊
          this.feedbackList = res.feedbackVo.map((item: any) => ({
            name: item.user.name,
            email: item.user.email,
            fillinDate: item.fillinDate
          }));

          // 將資料存入 service 作為快取
          this.inputDataService.answerData = {
            quizId: quizId,
            questArray: this.questArray,
            feedbackList: this.feedbackList
          };

        } else {
          this.dialogService.alert('取得回饋列表失敗');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('API 錯誤：', err);
        this.dialogService.alert('載入失敗，請稍後再試');
      }
    });
  }




  // 查看單一使用者回饋（可選擇後端提供詳細 API）
  viewFeedback(item: FeedbackItem) {
    const userData = this.questArray.find(
      data => data.user.email === item.email
    );
    console.log(userData);


    if (!userData) {
      this.dialogService.alert('找不到該使用者的資料');
      return;
    }

    // 把詳細資料放入共用 service，導頁顯示
    this.inputDataService.answerData = userData;
    this.router.navigate(['/user-confirm']);
  }


  //返回上一頁
  goBack() {
    this.inputDataService.answerData = null;
    this.router.navigate(['/user-list']);
  }
  //查看統計
  goStatistics(quizId: number) {   // quiz 是完整物件
  this.router.navigate(['/user-statistics'], { queryParams: { quizId } });
  console.log(quizId);

}
  //監聽瀏覽器後退
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // 清空 answerData
    this.inputDataService.answerData = null;
  }
}
