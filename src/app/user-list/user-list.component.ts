import { MangerService } from './../@services/manger.service';
import { Component, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';


//假資料的interface
export interface PeriodicElement {
  name: string;
  id: number;
  state: number;
  sTime: string;
  eTime: string;
  result: string;
}
//假資料
const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, name: 'JAVA前端課程意見回饋', state: 1, sTime: '2025-10-25', eTime: '2025-12-31', result: '查看結果' },
  { id: 2, name: 'Python資料分析問卷', state: 1, sTime: '2025-09-01', eTime: '2025-09-30', result: '查看結果' },
  { id: 3, name: 'UI/UX設計滿意度調查', state: 2, sTime: '2025-07-15', eTime: '2025-08-15', result: '查看結果' },
  { id: 4, name: '旅遊體驗回饋表單', state: 0, sTime: '2025-11-05', eTime: '2026-01-05', result: '查看結果' },
  { id: 5, name: '線上客服服務滿意度調查', state: 1, sTime: '2025-09-10', eTime: '2025-10-10', result: '查看結果' },
  { id: 6, name: '職涯培訓課程問卷', state: 2, sTime: '2025-05-01', eTime: '2025-06-01', result: '查看結果' },
  { id: 7, name: '餐飲體驗意見表', state: 0, sTime: '2025-12-01', eTime: '2026-01-15', result: '查看結果' },
  { id: 8, name: '專案管理工具使用回饋', state: 1, sTime: '2025-08-20', eTime: '2025-09-20', result: '查看結果' },
  { id: 9, name: '健康講座滿意度調查', state: 2, sTime: '2025-06-10', eTime: '2025-07-10', result: '查看結果' },
  { id: 10, name: 'AI應用工作坊問卷', state: 0, sTime: '2025-11-20', eTime: '2025-12-20', result: '查看結果' },
  { id: 11, name: '雲端技術培訓課程回饋', state: 1, sTime: '2025-09-15', eTime: '2025-10-15', result: '查看結果' },
  { id: 12, name: '日語學習工作坊調查', state: 2, sTime: '2025-04-10', eTime: '2025-05-10', result: '查看結果' },
  { id: 13, name: '職場溝通技巧課程問卷', state: 0, sTime: '2025-12-05', eTime: '2026-01-05', result: '查看結果' },
  { id: 14, name: '顧客服務體驗調查', state: 1, sTime: '2025-08-25', eTime: '2025-09-25', result: '查看結果' },
  { id: 15, name: '專業證照培訓課程回饋', state: 2, sTime: '2025-06-01', eTime: '2025-07-01', result: '查看結果' },
  { id: 16, name: '數位行銷策略問卷', state: 0, sTime: '2025-11-10', eTime: '2025-12-31', result: '查看結果' },
  { id: 17, name: '使用者介面研究調查', state: 1, sTime: '2025-09-05', eTime: '2025-09-30', result: '查看結果' },
  { id: 18, name: 'AI客服體驗問卷', state: 2, sTime: '2025-05-20', eTime: '2025-06-20', result: '查看結果' },
  { id: 19, name: '線上學習平台滿意度', state: 0, sTime: '2025-12-20', eTime: '2026-01-31', result: '查看結果' },
  { id: 20, name: '團隊合作工作坊回饋', state: 1, sTime: '2025-08-01', eTime: '2025-09-01', result: '查看結果' }
];

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
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

export class UserListComponent{

  chooseDateS !: string;
  chooseDateE !: string;
  searchData !: string;
  displayedColumns: string[] = ['id', 'name', 'state', 'sTime', 'eTime', 'result'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //管理者登入
  isAdmin !:boolean;
  selectData = output<any[]>()
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor( private mangerService: MangerService,) {}

  //頁面一啟動
  ngOnInit(): void {
    this.mangerService._isAdmin$.subscribe((res) => {
    this.isAdmin=res;
    //如果登入
    if (this.isAdmin) {
      if (!this.displayedColumns.includes('select')) {
        this.displayedColumns.unshift('select');
      }
    } else {
      // 如果你想登出時拿掉 select，可以這樣：
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'select');
    }
  });
  }

  //換頁方法
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    })
  }
  //排序=按照sTime
  sortByDate() {
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      if (a.sTime < b.sTime) {
        return -1;
      }
      if (a.sTime > b.sTime) {
        return 1;
      }
      return 0;
    })
  }
  //重新整理畫面
  reset() {
    location.reload();
  }
  //即時搜尋
  changeInput(event: Event) {
    let AllData: PeriodicElement[] = []; //PeriodicElement[]是資料類型
    for (let data of ELEMENT_DATA) {
      if (data.name.indexOf(this.searchData) != -1) { //indexOf抓取有該值的位置，若沒值為-1
        AllData.push(data);
      }
    }
    this.dataSource.data = AllData;
  }

  //管理者專區
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.outputData();
  }

    outputData() {
    let checkData: Array<any> = [];
    this.selection.selected.forEach(s => checkData.push(s));
    this.selectData.emit(checkData);
  }
  //刪除全家
  del() {
  // 用 selection.selected 取勾選的資料
  const selectedIds = this.selection.selected.map(s => s.id);
  // 過濾掉勾選的資料
  const newData = this.dataSource.data.filter(item => !selectedIds.includes(item.id));
  // 更新 dataSource
  this.dataSource.data = newData;
  // 清空勾選
  this.selection.clear();
  }
  //新增問卷
  goAdd(){}
}
