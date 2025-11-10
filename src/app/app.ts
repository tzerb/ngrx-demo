import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { CounterComponent } from './components/counter/counter';
import { UserListComponent } from './components/user-list/user-list';
import { UserSummaryComponent } from './components/user-summary/user-summary';
import { AppState } from './store/models/app-state.model';
import { selectDarkMode } from './store/selectors/ui.selectors';
import * as UIActions from './store/actions/ui.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CounterComponent, UserListComponent, UserSummaryComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ngrx-demo');
  private readonly store = inject(Store<AppState>);
  protected readonly darkMode$ = this.store.select(selectDarkMode);

  protected toggleDarkMode(): void {
    this.store.dispatch(UIActions.toggleDarkMode());
  }
}
