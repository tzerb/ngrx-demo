import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterComponent } from './components/counter/counter';
import { UserListComponent } from './components/user-list/user-list';
import { UserSummaryComponent } from './components/user-summary/user-summary';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CounterComponent, UserListComponent, UserSummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ngrx-demo');
}
