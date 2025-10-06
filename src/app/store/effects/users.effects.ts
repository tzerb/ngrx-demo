import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import * as UsersActions from '../actions/users.actions';
import * as UIActions from '../actions/ui.actions';
import { User } from '../models/user.model';
import { selectAllUsers } from '../selectors/users.selectors';
import { AppState } from '../models/app-state.model';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        // Simulate API call with mock data
        of([
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ] as User[]).pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error => of(UsersActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  validateAndAddUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUserRequest),
      withLatestFrom(this.store.select(selectAllUsers)),
      mergeMap(([action, users]) => {
        // Check for duplicate email
        const emailExists = users.some(
          u => u.email.toLowerCase() === action.user.email.toLowerCase()
        );

        if (emailExists) {
          return [UIActions.setModalError({ error: 'A user with this email already exists' })];
        }

        // Generate new ID
        const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
        const newUser: User = {
          id: maxId + 1,
          ...action.user
        };

        return [
          UsersActions.addUser({ user: newUser }),
          UIActions.closeAddUserModal()
        ];
      })
    )
  );
}
