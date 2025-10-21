import { InputDataService } from './@services/input-data.service';
import { MangerService } from './@services/manger.service';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,MatTooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private mangerService: MangerService, private inputDataService: InputDataService) { }
  isAdmin!: boolean;
  //一開始進網頁時觸發
  ngOnInit(): void {
    this.mangerService._isAdmin$.subscribe((res) => {
      this.isAdmin = res;
    });
  }

  logOut() {
    this.mangerService.logOut();
    this.inputDataService.answerData = null;
  }

  //點圖片回頂端
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // 平滑滾動回頂部
    });
  }
}
