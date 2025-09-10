import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  constructor(private router: Router) { }
  showPassword = false;
  account !: string;
  password !: string;

  changePasswordIcon() {
  this.showPassword = !this.showPassword;
  }

  logIn() {
    this.router.navigate(['/manger-list']);
  }
}
