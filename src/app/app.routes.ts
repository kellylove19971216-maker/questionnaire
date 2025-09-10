import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthorComponent } from './author/author.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserInputComponent } from './user-input/user-input.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { UserConfirmComponent } from './user-confirm/user-confirm.component';
import { LogInComponent } from './log-in/log-in.component';
import { MangerListComponent } from './manger-list/manger-list.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'author', component: AuthorComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'user-input', component: UserInputComponent },
  { path: 'user-statistics', component: UserStatisticsComponent },
  { path: 'user-confirm', component: UserConfirmComponent },
  { path: 'log-in', component: LogInComponent },
  { path: 'manger-list', component: MangerListComponent },
  { path: '', component: HomeComponent },
];
