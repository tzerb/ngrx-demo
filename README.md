# NgRx Demo - Angular 20 State Management

A comprehensive demonstration of NgRx state management patterns in Angular 20, showcasing best practices for managing application state with actions, reducers, effects, and selectors.

## Features

- ✅ Angular 20 with standalone components
- ✅ NgRx Store for state management
- ✅ NgRx Effects for side effects
- ✅ NgRx Entity for normalized state
- ✅ Redux DevTools integration
- ✅ Environment-based configuration
- ✅ TypeScript strict mode
- ✅ SCSS styling

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── counter/           # Counter component demonstrating basic NgRx usage
│   │   └── user-list/         # User list component demonstrating Effects
│   ├── store/
│   │   ├── actions/          # Action creators
│   │   │   ├── counter.actions.ts
│   │   │   └── users.actions.ts
│   │   ├── reducers/         # State reducers
│   │   │   ├── counter.reducer.ts
│   │   │   ├── users.reducer.ts
│   │   │   └── index.ts
│   │   ├── effects/          # Side effects
│   │   │   └── users.effects.ts
│   │   ├── selectors/        # State selectors
│   │   │   ├── counter.selectors.ts
│   │   │   └── users.selectors.ts
│   │   └── models/           # TypeScript interfaces
│   │       ├── app-state.model.ts
│   │       └── user.model.ts
│   ├── app.config.ts         # App configuration with NgRx providers
│   └── app.ts
└── environments/             # Environment configurations
    ├── environment.ts
    └── environment.prod.ts
```

## NgRx Concepts Demonstrated

### 1. **Actions** (`src/app/store/actions/`)
Actions are unique events that describe state changes:
```typescript
export const increment = createAction('[Counter] Increment');
export const loadUsers = createAction('[Users] Load Users');
```

### 2. **Reducers** (`src/app/store/reducers/`)
Pure functions that handle state transitions:
```typescript
export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => ({ ...state, count: state.count + 1 }))
);
```

### 3. **Selectors** (`src/app/store/selectors/`)
Memoized functions to derive state:
```typescript
export const selectCount = createSelector(
  selectCounterState,
  (state) => state.count
);
```

### 4. **Effects** (`src/app/store/effects/`)
Handle side effects like API calls:
```typescript
loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadUsers),
    switchMap(() => this.api.getUsers().pipe(
      map(users => loadUsersSuccess({ users }))
    ))
  )
);
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Development Server

Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

## Using Redux DevTools

This project includes Redux DevTools integration for debugging:

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension) in your browser
2. Open DevTools (F12)
3. Select the Redux tab
4. Interact with the application and observe state changes

## Key NgRx Patterns

### Dispatching Actions
```typescript
this.store.dispatch(increment());
this.store.dispatch(loadUsers());
```

### Selecting State
```typescript
count$ = this.store.select(selectCount);
users$ = this.store.select(selectAllUsers);
```

### Using Async Pipe
```html
<h3>Count: {{ count$ | async }}</h3>
<div *ngFor="let user of users$ | async">{{ user.name }}</div>
```

## Environment Configuration

The project uses file replacement for environment-specific configurations:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

Configure in `angular.json`:
```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

## Best Practices Implemented

1. **Immutable State Updates**: Always return new state objects
2. **Action Naming**: Use `[Source] Event` format (e.g., `[Counter] Increment`)
3. **Selector Composition**: Build complex selectors from simple ones
4. **Effect Error Handling**: Use `catchError` to handle API failures
5. **TypeScript Types**: Strong typing for state, actions, and selectors
6. **Standalone Components**: Modern Angular architecture without NgModules

## Learn More

- [NgRx Documentation](https://ngrx.io)
- [Angular Documentation](https://angular.dev)
- [Redux Pattern](https://redux.js.org/understanding/thinking-in-redux/three-principles)

## License

This project is for demonstration purposes.
