import { ChangeDetectorRef, Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpService } from '../@services/http.service';
import { InputDataService } from '../@services/input-data.service';
import { DialogService } from '../@services/dialog.service';

@Component({
  selector: 'app-user-statistics',
  imports: [RouterModule],
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.scss'
})
export class UserStatisticsComponent {

  // 預先初始化 statisticVo，避免 undefined
  statisticVo: any = {
    quiz: {
      title: '',
      startDate: '',
      endDate: '',
      description: ''
    },
    questionVoList: []
  };
  currentQuizId: number = 0;
  private dataLoaded = false;  // 👈 標記資料是否載入完成

  constructor(
    private inputDataService: InputDataService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
      // 從 URL queryParams 取得 quizId
      this.route.queryParams.subscribe(params => {
        const quizId = Number(params['quizId']); // 轉成數字
        if (quizId > 0) {
          this.currentQuizId = quizId;
          this.getStatistics(quizId);
        } else {
          this.dialogService.alert('缺少問卷 ID');
          this.router.navigate(['/user-list']);
        }
      });
    }

  // 呼叫後端統計 API
  getStatistics(quizId: number) {
    this.httpService.getStatisticsApi('quiz/statistics', { quizId }).subscribe({
      next: (res: any) => {
        if (res?.statisticVo) {
           console.log(res);
          // 取統計資料
          this.statisticVo = res.statisticVo;


          // ===== 轉換資料供 HTML 使用 =====
          this.statisticVo.questionVoList = this.statisticVo.questionCountVoList.map((q: any) => {
            const labels = q.optionsCountList?.map((opt: any) => opt.optionName) || [];
            const data = q.optionsCountList?.map((opt: any) => opt.count) || [];
            return {
              ...q,
              id: q.questionId,   // HTML 用 chart.id
              label: q.name,      // HTML 用 chart.label
              labels,             // HTML 用 chart.labels
              data                // HTML 用 chart.data
            };
          });

          // 👇 標記資料已載入,並觸發變更檢測
          this.dataLoaded = true;
          this.cdr.detectChanges();

          // 👇 如果 View 已經初始化,直接創建圖表
          this.createCharts();
        } else {
          this.dialogService.alert('該問卷沒有統計資料');
        }
      },
      error: (err: any) => {
        console.error('取得統計資料失敗', err);
        this.dialogService.alert('取得統計資料失敗');
      }
    });
  }

  // 👇 View 初始化後執行
  ngAfterViewInit(): void {
    // 如果資料已經載入完成,創建圖表
    if (this.dataLoaded) {
      this.createCharts();
    }
  }


  createCharts(): void {
    if (!this.statisticVo?.questionVoList) return;

    for (let chart of this.statisticVo.questionVoList) {
      if (chart.type === 'T') continue;

      const ctx = document.getElementById(chart.id) as HTMLCanvasElement;
      if (!ctx) {
        console.warn(`找不到 canvas: ${chart.id}`);
        continue;
      }

      const backgroundColor = [
        '#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c',
        '#f4a261', '#2a9d8f', '#e76f51'
      ];

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chart.labels,
          datasets: [{
            label: chart.label,
            data: chart.data,
            backgroundColor,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'center'
            }
          },
          radius: 100
        }
      });
    }
  }


  // ngAfterViewInit(): void {
  //   for (let chartData of this.statisticVo.questionVoList) {
  //     if (chartData.type != 'T') {
  //       let ctx = document.getElementById(chartData.id) as HTMLCanvasElement;

  //       let data = {
  //         labels: chartData.labels,
  //         datasets: [
  //           {
  //             label: chartData.label,
  //             data: chartData.data,
  //             backgroundColor: chartData.backgroundColor,
  //             hoverOffset: 10,
  //           },
  //         ],
  //       };
  //       let chart = new Chart(ctx, {
  //         type: 'pie',
  //         data: data,
  //         options: {
  //           responsive: true,
  //           maintainAspectRatio: false,
  //           plugins: {
  //             legend: {
  //               position: 'top',
  //               align: 'center', // 讓圖例置中對齊
  //             },
  //           },
  //           // 固定半徑，避免 legend 改變大小
  //           radius: 100,
  //         },
  //       });
  //     }
  //   }
  // }


  // //圖表假資料
  // statisticVo = {
  //   quiz:
  //   {
  //   quizId:1,
  //   title: 'UI/UX 設計滿意度調查',
  //   startDate: '2025-09-15',
  //   endDate: '2025-10-31',
  //   description: '本問卷旨在了解使用者對於我們系統的 UI/UX 設計滿意度，請您根據實際使用經驗，選擇最符合您感受的選項，您的回饋將有助於我們持續改進設計品質，提升使用體驗，感謝您的參與與支持！',
  //   },
  //   questionVoList: [
  //     {
  //       id: '1',
  //       type: 'Q',
  //       label: '您對整體 UI/UX 設計的滿意度為何？',
  //       labels: ['非常不滿意', '不滿意', '普通', '滿意', '非常滿意'],
  //       data: [20, 30, 100, 200, 150], // 模擬數據
  //       dataText: [],
  //       backgroundColor: ['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
  //     },
  //     {
  //       id: '2',
  //       type: 'Q',
  //       label: '您覺得介面設計的清晰度與易用性如何？',
  //       labels: ['非常差', '差', '普通', '好', '非常好'],
  //       data: [10, 25, 80, 220, 165],
  //       dataText: [],
  //       backgroundColor:['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
  //     },
  //     {
  //       id: '3',
  //       type: 'M',
  //       label: '您覺得本系統中最有幫助或設計最好的部分是哪些？（可複選）',
  //       labels: ['介面排版與視覺設計', '操作流程與互動體驗', '功能完整性', '資訊呈現的清晰度', '響應速度與效能'],
  //       data: [180, 200, 150, 120, 90],
  //       dataText: [],
  //       backgroundColor:['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
  //     },
  //     {
  //       id: '4',
  //       type: 'M',
  //       label: '您希望未來在 UI/UX 設計上加強哪些面向？（可複選）',
  //       labels: ['更多一致性的設計風格', '更直覺的操作流程', '更佳的行動裝置體驗', '色彩與字體搭配', '輔助說明（提示文字、教學指引）'],
  //       data: [130, 220, 190, 160, 110],
  //       dataText: [],
  //       backgroundColor: ['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
  //     },
  //     {
  //       id: '5',
  //       type: 'T',
  //       label: '您覺得目前設計中最值得保留的優點是什麼？',
  //       labels: [''],
  //       data: [],
  //       dataText: ['老師很帥的部分。'],
  //       backgroundColor: []
  //     },
  //     {
  //       id: '6',
  //       type: 'T',
  //       label: '您對 UI/UX 設計還有哪些建議或回饋？',
  //       labels: [''],
  //       data: [],
  //       dataText: ['希望老師可以多教一點，不然我美化好醜。希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜'],
  //       backgroundColor: []
  //     }
  //   ]
  // }

}
