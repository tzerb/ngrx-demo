# NgRx State Management Guide

## Overview

This guide explains the NgRx implementation in this Angular 20 project. NgRx implements the Redux pattern for predictable state management in Angular applications.

## Core Concepts

### 1. Store (Single Source of Truth)

The store holds the entire application state in a single immutable data structure.

```typescript
// app-state.model.ts
export interface AppState {
  counter: CounterState;
  users: UsersState;
}
```

### 2. Actions (Events)

Actions are dispatched to describe state changes. They follow the pattern `[Source] Event`.

```typescript
// counter.actions.ts
export const increment = createAction('[Counter] Increment');
export const decrement = createAction('[Counter] Decrement');
export const incrementByAmount = createAction(
  '[Counter] Increment By Amount',
  props<{ amount: number }>()
);
```

**Best Practices:**
- Use descriptive action names
- Include the source in brackets: `[Component/Service Name] Action`
- Use `props<>()` for actions with payloads

### 3. Reducers (State Changes)

Reducers are pure functions that take current state and an action, returning new state.

```typescript
// counter.reducer.ts
export const counterReducer = createReducer(
  initialState,
  on(CounterActions.increment, (state) => ({
    ...state,
    count: state.count + 1
  })),
  on(CounterActions.incrementByAmount, (state, { amount }) => ({
    ...state,
    count: state.count + amount
  }))
);
```

**Best Practices:**
- Never mutate state directly
- Always return a new state object
- Keep reducers pure (no side effects)

### 4. Selectors (Derived State)

Selectors are memoized functions that derive and compute state.

```typescript
// counter.selectors.ts
export const selectCounterState = createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
  selectCounterState,
  (state: CounterState) => state.count
);

export const selectIsEven = createSelector(
  selectCount,
  (count: number) => count % 2 === 0
);
```

**Benefits:**
- Memoization improves performance
- Compose complex selectors from simple ones
- Centralized state access logic

### 5. Effects (Side Effects)

Effects handle asynchronous operations and side effects like API calls.

```typescript
// users.effects.ts
@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error =>
            of(UsersActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
```

**Best Practices:**
- Always handle errors with `catchError`
- Use appropriate RxJS operators (switchMap, mergeMap, exhaustMap)
- Return new actions from effects

## Component Integration

### Injecting the Store

```typescript
export class Counter {
  count$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.count$ = this.store.select(selectCount);
  }
}
```

### Dispatching Actions

```typescript
increment() {
  this.store.dispatch(CounterActions.increment());
}

incrementByAmount(amount: number) {
  this.store.dispatch(CounterActions.incrementByAmount({ amount }));
}
```

### Using in Templates

```html
<!-- Subscribe with async pipe -->
<h3>Count: {{ count$ | async }}</h3>

<!-- Use with structural directives -->
<div *ngIf="loading$ | async">Loading...</div>
<div *ngFor="let user of users$ | async">{{ user.name }}</div>
```

## File Structure

```
store/
├── actions/          # Action creators
│   ├── counter.actions.ts
│   └── users.actions.ts
├── reducers/         # State reducers
│   ├── counter.reducer.ts
│   ├── users.reducer.ts
│   └── index.ts      # Combine reducers
├── effects/          # Side effects
│   └── users.effects.ts
├── selectors/        # State selectors
│   ├── counter.selectors.ts
│   └── users.selectors.ts
└── models/           # TypeScript interfaces
    ├── app-state.model.ts
    └── user.model.ts
```

## Setup in app.config.ts

```typescript
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers),
    provideEffects([UsersEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
```

## Common Patterns

### Loading Pattern (for async data)

```typescript
// State
interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Actions
loadUsers = createAction('[Users] Load Users');
loadUsersSuccess = createAction('[Users] Load Success', props<{ users: User[] }>());
loadUsersFailure = createAction('[Users] Load Failure', props<{ error: string }>());

// Reducer
on(loadUsers, state => ({ ...state, loading: true, error: null })),
on(loadUsersSuccess, (state, { users }) => ({
  ...state,
  users,
  loading: false
})),
on(loadUsersFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
}))
```

### Normalized State (with NgRx Entity)

```typescript
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UsersState = adapter.getInitialState({
  loading: false,
  error: null
});

// Reducer methods
on(loadUsersSuccess, (state, { users }) =>
  adapter.setAll(users, { ...state, loading: false })
)
```

## Debugging with Redux DevTools

1. Install Redux DevTools browser extension
2. Open browser DevTools (F12)
3. Navigate to Redux tab
4. Features:
   - View all dispatched actions
   - Inspect state at any point
   - Time-travel debugging
   - Export/import state

## Best Practices Summary

1. **Immutability**: Never mutate state directly
2. **Action Naming**: Use `[Source] Event` pattern
3. **Single Responsibility**: One action per event
4. **Normalize State**: Use NgRx Entity for collections
5. **Error Handling**: Always handle errors in effects
6. **Type Safety**: Use TypeScript interfaces for everything
7. **Selector Composition**: Build complex selectors from simple ones
8. **Avoid Logic in Components**: Move business logic to effects and selectors
9. **One Store**: Keep all app state in a single store
10. **Testing**: Write unit tests for reducers and effects

## Testing Examples

### Testing Reducers

```typescript
describe('Counter Reducer', () => {
  it('should increment count', () => {
    const action = increment();
    const state = counterReducer(initialState, action);
    expect(state.count).toBe(1);
  });
});
```

### Testing Selectors

```typescript
describe('Counter Selectors', () => {
  it('should select count', () => {
    const state = { counter: { count: 5 } };
    const result = selectCount(state);
    expect(result).toBe(5);
  });
});
```

## Resources

- [Official NgRx Documentation](https://ngrx.io)
- [Redux Pattern](https://redux.js.org)
- [RxJS Documentation](https://rxjs.dev)
