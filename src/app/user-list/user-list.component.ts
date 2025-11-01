import { MangerService } from './../@services/manger.service';
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputDataService } from '../@services/input-data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Quiz } from '../@interface/questionnaire.interface';
import { HttpService } from '../@services/http.service';
import { Router } from '@angular/router';


// ====== 額外的顯示資料結構 ======
export interface QuizList extends Quiz {
  state: number;  // 0=尚未開始, 1=進行中, 2=已截止
  result: string; // 顯示狀態文字
}

// ====== 狀態計算方法 ======
function computeState(startDate: string, endDate: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T23:59:59');

  if (today < start) return 0;
  if (today > end) return 2;
  return 1;
}

// ====== 狀態對應顯示文字 ======
function computeResultLabel(startDate: string, endDate: string, isAdmin = false): string {
  const state = computeState(startDate, endDate);
  if (isAdmin) {
    if (state === 0) return '編輯問卷';
    return '查看回饋';
  } else {
    if (state === 0) return '尚未開始';
    if (state === 1) return '開始填寫';
    return '查看結果';
  }
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent {

  //問卷欄位的interface
  quizInfo: Quiz = {
    id: 1,
    title: '',
    startDate: '',
    endDate: '',
    description: ''
  };

  today!: string;
  chooseDateS !: string;
  chooseDateE !: string;
  searchData !: string;
  displayedColumns: string[] = ['id', 'title', 'state', 'startDate', 'endDate', 'result'];
  //管理者登入
  isAdmin !: boolean;
  selectData = output<any[]>()
  selection = new SelectionModel<QuizList>(true, []);
  //排序
  isAsc: boolean = true;
  //分類搜尋
  searchState: number = -1; // 預設 -1 或空值代表「全部」
  dataSource = new MatTableDataSource<QuizList>([]);
  data: QuizList[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private inputDataService: InputDataService,
    private mangerService: MangerService,
    private httpService: HttpService,
    private router: Router,
  ) { }

  //頁面一啟動
  ngOnInit(): void {
    //最小值為今天
    const t = new Date();
    this.today = t.toISOString().split('T')[0]; // 直接取 YYYY-MM-DD

    //判斷管理者
    this.mangerService._isAdmin$.subscribe((res) => {
      this.isAdmin = res;
      if (this.isAdmin) {
        if (!this.displayedColumns.includes('select')) {
          this.displayedColumns.unshift('select');
        }
      } else {
        // 登出時拿掉 select
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'select');
      }
    });
        // 取得後端資料
    this.loadQuizList();
  }


  //換頁方法
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

   // ================= 從後端取得問卷列表 =================
  loadQuizList() {
    this.httpService.getApi('quiz/list', {}) // POST 請求
      .subscribe({
        next: (res: any) => {
          if (res.code === 200 && res.data) {
            this.data = res.data.map((q: Quiz) => ({
              ...q,
              state: computeState(q.startDate, q.endDate),
              result: computeResultLabel(q.startDate, q.endDate, this.isAdmin)
            }));
            this.dataSource.data = this.data;
          } else {
            this.dataSource.data = [];
          }
        },
      });
  }


  //顯示狀態的方法
  getStateText(state: number): string {
    switch (state) {
      case 0: return '尚未開始';
      case 1: return '進行中';
      case 2: return '已截止';
      default: return '未知狀態';
    }
  }

  //下拉選單改變時呼叫
  applyFilter() {
    this.dataSource.data = this.data.filter(data =>
      this.searchState === -1 || data.state === this.searchState
    );
  }

  //狀態顏色的方法
  getStateClass(state: number): string {
    switch (state) {
      case 0: return 'state-not-started';
      case 1: return 'state-in-progress';
      case 2: return 'state-ended';
      default: return '';
    }
  }

  //排序-按照編號
  sortById() {
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      if (this.isAsc) {
        return a.id - b.id; // 升冪
      } else {
        return b.id - a.id; // 降冪
      }
    });

    // 每次呼叫後翻轉排序狀態
    this.isAsc = !this.isAsc;
  }

  //重新整理畫面
  reset() {
    location.reload();
  }

  //即時搜尋
  changeInput(event: Event) {
    const term = this.searchData.toLowerCase();
    this.dataSource.data = this.data.filter(d => d.title.toLowerCase().includes(term));
  }

  // ================= 管理者專區 =================

  /**
   * 檢查是否「全選」
   * 若目前勾選數量 = 資料總數，代表所有列都已被選取
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length; // 已勾選的列數
    const numRows = this.dataSource.data.length;       // 目前顯示的總列數
    return numSelected === numRows;                    // 回傳是否全選
  }

  /**
   * 全選 / 全不選 切換功能
   * 若已全選 -> 清空選取；
   * 若尚未全選 -> 勾選所有資料列。
   */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear() // 若全選狀態 -> 清空所有選取
      : this.dataSource.data.forEach(row => this.selection.select(row)); // 否則全選
    this.outputData(); // 每次變動後都輸出目前被選取的資料
  }

  /**
  * 將目前勾選的資料（selection.selected）整理後透過 output() 向外輸出
  * 用於父元件接收或後續操作（如批次刪除、導出、編輯）
  */
  outputData() {
    let checkData: Array<any> = [];
    // 將選中的資料一筆筆加入陣列
    this.selection.selected.forEach(s => checkData.push(s));
    // 使用 @Output() 的 EventEmitter 將選中資料傳給外部父元件
    this.selectData.emit(checkData);
  }

// 管理者編輯問卷
edit(element: QuizList) {
  // quiz/question_list 取得題目與選項
  this.httpService.getOptionApi('quiz/question_list', { quizId: element.id.toString() })
    .subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.questionVoList) {
          // 組合完整 answerData
          this.inputDataService.answerData = {
            quiz: {
              id: element.id,
              title: element.title,
              startDate: element.startDate,
              endDate: element.endDate,
              description: element.description
            },
            questionVoList: res.questionVoList
          };
          this.router.navigate(['/manger-input']);
        } else {
          console.error('取得問卷題目失敗', res);
        }
      },
      error: (err: any) => {
        console.error('API呼叫錯誤：', err);
      }
    });
}



  //刪除全家
  del() {
    // 用 selection.selected 取勾選的資料
    const selectedIds = this.selection.selected.map(s => s.id);
    // 過濾掉勾選的資料，並更新 dataSource
    this.dataSource.data = this.dataSource.data.filter(item => !selectedIds.includes(item.id));
    // 清空勾選
    this.selection.clear();
  }

  feedback(){
    this.router.navigate(['/feedback']);
  }
}
