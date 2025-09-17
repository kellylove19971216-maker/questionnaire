import { InputDataService } from './@services/input-data.service';
import { MangerService } from './@services/manger.service';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    constructor( private mangerService: MangerService,private inputDataService:InputDataService) {}
    isAdmin!:boolean;
    //一開始進網頁時觸發
    ngOnInit(): void {
      this.mangerService._isAdmin$.subscribe((res) => {
      this.isAdmin=res;
    });
    }

    logOut(){
      this.mangerService.logOut();
      this.inputDataService.answerData=null;
    }
}
