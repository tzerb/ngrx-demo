import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as CounterActions from '../actions/counter.actions';
import * as UsersActions from '../actions/users.actions';
import * as LogActions from '../actions/log.actions';

@Injectable()
export class LogEffects {
  private actions$ = inject(Actions);

  logCounterIncrement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CounterActions.increment),
      map(() => LogActions.addLogEntry({ message: 'Counter incremented by 1' }))
    )
  );

  logCounterDecrement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CounterActions.decrement),
      map(() => LogActions.addLogEntry({ message: 'Counter decremented by 1' }))
    )
  );

  logCounterReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CounterActions.reset),
      map(() => LogActions.addLogEntry({ message: 'Counter reset to 0' }))
    )
  );

  logCounterIncrementByAmount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CounterActions.incrementByAmount),
      map(({ amount }) => LogActions.addLogEntry({
        message: `Counter ${amount > 0 ? 'incremented' : 'decremented'} by ${Math.abs(amount)}`
      }))
    )
  );

  logUserAdded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      map(({ user }) => LogActions.addLogEntry({
        message: `User added: ${user.name} (${user.email})`
      }))
    )
  );

  logUserDeleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      map(({ id }) => LogActions.addLogEntry({
        message: `User deleted: ID #${id}`
      }))
    )
  );

  logUsersLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsersSuccess),
      map(({ users }) => LogActions.addLogEntry({
        message: `Loaded ${users.length} users from API`
      }))
    )
  );
}
