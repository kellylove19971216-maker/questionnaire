import { Component } from '@angular/core';
import { InputDataService } from '../@services/input-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  constructor(
    private inputDataService: InputDataService,
    private router: Router,) { }

  questArray = [
    { questName: '小珈', questTime: '2025/11/13 17:35' },
    { questName: 'Allen', questTime: '2025/11/02 07:15' },
    { questName: '公主', questTime: '2025/11/30 12:35' },
  ]

  goPreview() {
    this.inputDataService.answerData={
      name:"小珈",
      city:"台北市",
      age:18,
      sex:"女",
      phone:"0983458001",
      email:"kelly19990730@gmail.com",
      id: 1,
      title: 'UI/UX 設計滿意度調查',
      sTime: '2025-09-15',
      eTime: '2025-10-31',
      explain:
        '本問卷旨在蒐集使用者對系統介面與操作體驗的意見與建議，透過您的回饋，我們能更清楚了解設計的優缺點，以便持續改進與優化，提供更佳的使用體驗。感謝您撥冗填寫！',
      questArray: [
        {
          questId: 1,
          need: true,
          exist: true,
          questName: '您對整體 UI/UX 設計的滿意度為何？',
          type: 'Q',
          options: [
            { optionName: '非常不滿意', code: 'A' ,boxBollen: false},
            { optionName: '不滿意', code: 'B', boxBollen: false},
            { optionName: '普通', code: 'C', boxBollen: false },
            { optionName: '滿意', code: 'D', boxBollen: false },
            { optionName: '非常滿意', code: 'E' , boxBollen: false},
          ],
          radioAnswer: 'D', // 假答案
          textAnswer: '',
        },
        {
          questId: 2,
          need: true,
          exist: true,
          questName: '您覺得介面設計的清晰度與易用性如何？',
          type: 'Q',
          options: [
            { optionName: '非常差', code: 'A', boxBollen: false},
            { optionName: '差', code: 'B', boxBollen: false },
            { optionName: '普通', code: 'C' , boxBollen: false},
            { optionName: '好', code: 'D' , boxBollen: false},
            { optionName: '非常好', code: 'E', boxBollen: false },
          ],
          radioAnswer: 'E', // 假答案
          textAnswer: '',
        },
        {
          questId: 3,
          need: true,
          exist: true,
          questName:
            '您覺得本系統中最有幫助或設計最好的部分是哪些？（可複選）',
          type: 'M',
          options: [
            { optionName: '介面排版與視覺設計', code: 'A', boxBollen: false },
            { optionName: '操作流程與互動體驗', code: 'B', boxBollen: true},
            { optionName: '功能完整性', code: 'C', boxBollen: false },
            { optionName: '資訊呈現的清晰度', code: 'D', boxBollen: true },
            { optionName: '響應速度與效能', code: 'E' , boxBollen: false},
          ],
          radioAnswer: '',
          textAnswer: '',
        },
        {
          questId: 4,
          need: true,
          exist: true,
          questName:
            '您希望未來在 UI/UX 設計上加強哪些面向？（可複選）',
          type: 'M',
          options: [
            { optionName: '更多一致性的設計風格', code: 'A', boxBollen: false },
            { optionName: '更直覺的操作流程', code: 'B', boxBollen: true },
            { optionName: '更佳的行動裝置體驗', code: 'C', boxBollen: true },
            { optionName: '色彩與字體搭配', code: 'D' , boxBollen: false},
            { optionName: '輔助說明（提示文字、教學指引）', code: 'E' , boxBollen: true},
          ],
          radioAnswer: '',
          textAnswer: '',
        },
        {
          questId: 5,
          need: true,
          exist: true,
          questName: '您覺得目前設計中最值得保留的優點是什麼？',
          type: 'T',
          options: [],
          radioAnswer: '',
          textAnswer: '整體配色溫和，使用起來很舒服。',
        },
        {
          questId: 6,
          need: true,
          exist: true,
          questName: '您對 UI/UX 設計還有哪些建議或回饋？',
          type: 'T',
          options: [],
          radioAnswer: '',
          textAnswer: '希望在操作流程上能再更簡化，例如縮短步驟數；另外能提供新手提示，讓第一次使用的人更容易上手。',
        },
      ],
    };
    this.router.navigate(['/user-confirm']);
  }

  goBack() {
    this.router.navigate(['/user-list']);
  }
}
