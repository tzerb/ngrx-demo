import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/models/app-state.model';
import { User } from '../../store/models/user.model';
import { selectAllUsers, selectUsersCount } from '../../store/selectors/users.selectors';

@Component({
  selector: 'app-user-summary',
  imports: [CommonModule],
  templateUrl: './user-summary.html',
  styleUrl: './user-summary.scss'
})
export class UserSummaryComponent {
  users$: Observable<User[]>;
  userCount$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.users$ = this.store.select(selectAllUsers);
    this.userCount$ = this.store.select(selectUsersCount);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
