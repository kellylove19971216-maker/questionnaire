import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-statistics',
  imports: [RouterModule ],
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.scss'
})
export class UserStatisticsComponent {

  //圖表假資料
  chartArray = {
    questName: 'UI/UX 設計滿意度調查',
    sDate: '2025/09/15',
    eDate: '2025/10/31',
    quest: [
      {
        id: '1',
        type: 'Q',
        label: '您對整體 UI/UX 設計的滿意度為何？',
        labels: ['非常不滿意', '不滿意', '普通', '滿意', '非常滿意'],
        data: [20, 30, 100, 200, 150], // 模擬數據
        dataText: [],
        backgroundColor: ['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
      },
      {
        id: '2',
        type: 'Q',
        label: '您覺得介面設計的清晰度與易用性如何？',
        labels: ['非常差', '差', '普通', '好', '非常好'],
        data: [10, 25, 80, 220, 165],
        dataText: [],
        backgroundColor:['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
      },
      {
        id: '3',
        type: 'M',
        label: '您覺得本系統中最有幫助或設計最好的部分是哪些？（可複選）',
        labels: ['介面排版與視覺設計', '操作流程與互動體驗', '功能完整性', '資訊呈現的清晰度', '響應速度與效能'],
        data: [180, 200, 150, 120, 90],
        dataText: [],
        backgroundColor:['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
      },
      {
        id: '4',
        type: 'M',
        label: '您希望未來在 UI/UX 設計上加強哪些面向？（可複選）',
        labels: ['更多一致性的設計風格', '更直覺的操作流程', '更佳的行動裝置體驗', '色彩與字體搭配', '輔助說明（提示文字、教學指引）'],
        data: [130, 220, 190, 160, 110],
        dataText: [],
        backgroundColor: ['#b08968', '#d6ccc2', '#e0afa0', '#8d99ae', '#6c584c']
      },
      {
        id: '5',
        type: 'T',
        label: '您覺得目前設計中最值得保留的優點是什麼？',
        labels: [''],
        data: [],
        dataText: ['老師很帥的部分。'],
        backgroundColor: []
      },
      {
        id: '6',
        type: 'T',
        label: '您對 UI/UX 設計還有哪些建議或回饋？',
        labels: [''],
        data: [],
        dataText: ['希望老師可以多教一點，不然我美化好醜。希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜希望老師可以多教一點，不然我美化好醜'],
        backgroundColor: []
      }
    ]
  }

  ngAfterViewInit(): void {
    for (let chartData of this.chartArray.quest) {
      if (chartData.type != 'T') {
        let ctx = document.getElementById(chartData.id) as HTMLCanvasElement;

        let data = {
          labels: chartData.labels,
          datasets: [
            {
              label: chartData.label,
              data: chartData.data,
              backgroundColor: chartData.backgroundColor,
              hoverOffset: 10,
            },
          ],
        };
        let chart = new Chart(ctx, {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                align: 'center', // 讓圖例置中對齊
              },
            },
            // 固定半徑，避免 legend 改變大小
            radius: 100,
          },
        });
      }
    }
  }
}
