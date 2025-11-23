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
    const initials = name
      .split(/\s+/)
      .filter(n => n.length > 0)
      .map(n => {
        // Use Array.from or spread operator to handle multi-byte characters like emojis
        const chars = Array.from(n);
        const char = chars[0] || '';
        // Only uppercase if it's a letter (ASCII or extended)
        return /^[a-z]$/i.test(char) ? char.toUpperCase() : char;
      })
      .join('');

    // Use Array.from to ensure we slice by Unicode characters, not code units
    return Array.from(initials).slice(0, 2).join('');
  }
}
