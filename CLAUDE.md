# NGRx Demo Project

## Project Overview
Angular application demonstrating NgRx state management patterns with comprehensive test coverage. This project uses standalone components and modern Angular features.

## Tech Stack
- **Framework**: Angular 20.3.0 (standalone components)
- **State Management**: NgRx 20.0.1 (Store, Effects, Selectors)
- **Language**: TypeScript 5.9.2
- **Testing**: Jasmine + Karma
- **Build Tool**: Angular CLI

---

## Development Philosophy: Test-Driven Development (TDD)

**YOU MUST follow Test-Driven Development for ALL new features and changes.**

### TDD Workflow (Red-Green-Refactor)

1. **RED - Write Failing Tests First**
   - Before writing ANY implementation code, create comprehensive unit tests
   - Tests should define the expected behavior through assertions
   - Run tests to confirm they FAIL (this validates the tests are working)
   - Never skip this step - failing tests prove your tests are valid

2. **GREEN - Implement Minimal Code**
   - Write the simplest code that makes the tests pass
   - Focus on functionality, not perfection
   - Run tests frequently to verify progress

3. **REFACTOR - Improve Code Quality**
   - Clean up code while keeping tests green
   - Improve readability, reduce duplication, optimize performance
   - Tests must continue passing throughout refactoring

4. **COMMIT - Save Progress**
   - Commit tests and implementation together
   - Use descriptive commit messages that explain the "why"

### When User Requests a Feature

**Default assumption: They want tests included.**

Even if the user doesn't explicitly mention tests, YOU MUST:
- Write tests first (TDD approach)
- Include comprehensive test coverage
- Test edge cases and error conditions
- Only ask about testing approach if there's ambiguity about test type (unit vs integration vs e2e)

---

## Testing Standards

### Coverage Requirements
- **Minimum Coverage**: 80% for all code
- **Target Coverage**: 95%+ for production code
- **Critical Paths**: 100% coverage (authentication, data mutations, business logic)

### Test File Organization
- **Location**: Place test files adjacent to source files
  - `feature.ts` → `feature.spec.ts`
  - `component.ts` → `component.spec.ts`
- **Structure**: Mirror the source file's describe blocks
- **Naming**: Use clear, descriptive test names

### Test Naming Convention
```typescript
it('should [expected behavior] when [condition]', () => {
  // Test implementation
});
```

**Examples:**
- `should increment count by 1 when increment action is dispatched`
- `should return error when email already exists`
- `should display loading spinner when users are being fetched`

### Assertion Standards
- **Minimum**: 3+ assertions per test case
- **Prefer**: Specific matchers over generic equality
  - ✅ `expect(result).toBe(true)`
  - ✅ `expect(array).toContain(item)`
  - ❌ `expect(result == true).toBeTruthy()`

---

## NgRx Testing Requirements

### Reducers (Pure Functions - Easiest to Test)
**MUST test:**
- Initial state
- Each action's state transformation
- Immutability (new state object created)
- Edge cases (empty arrays, null values, boundary conditions)

**Example:**
```typescript
describe('UserReducer', () => {
  it('should return initial state', () => {
    const result = userReducer(undefined, { type: 'unknown' });
    expect(result).toEqual(initialState);
  });

  it('should create new state object (immutability)', () => {
    const state = { ...initialState };
    const result = userReducer(state, addUser({ user: mockUser }));
    expect(result).not.toBe(state);
  });
});
```

### Selectors (Derived State)
**MUST test:**
- Basic selection from state
- Derived/computed values
- Parameterized selectors (e.g., `selectUserById(id)`)
- Memoization behavior (if complex)

**Example:**
```typescript
it('should select user by id', () => {
  const selector = selectUserById(2);
  const result = selector.projector([user1, user2, user3]);
  expect(result).toEqual(user2);
});
```

### Effects (Async Operations - Critical)
**MUST test:**
- Successful API call flows
- Error handling and failure scenarios
- Action dispatching (both success and failure)
- Business logic (e.g., duplicate validation)
- Observable streams and operators

**Use:**
- `provideMockActions()` for action streams
- `MockStore` for state access
- Marble testing for complex observables (if needed)

**Example:**
```typescript
it('should return error when email exists', (done) => {
  store.overrideSelector(selectAllUsers, [{ email: 'test@example.com' }]);
  actions$ = of(addUserRequest({ user: { email: 'test@example.com' } }));

  effects.validateAndAddUser$.subscribe(action => {
    expect(action.type).toBe('[UI] Set Modal Error');
    done();
  });
});
```

### Actions (Simple but Important)
**SHOULD test:**
- Action creators produce correct type
- Payload structure matches interface
- Type safety (TypeScript handles most of this)

---

## Component Testing Requirements

### Standalone Components
**MUST test:**
- Component creation
- Input/Output bindings
- User interactions (clicks, form submissions)
- Store dispatching (verify actions dispatched)
- Observable subscriptions (verify selector data flows)
- Template rendering (critical UI elements)

### Form Components
**MUST test:**
- Valid form submission
- Invalid/empty form rejection
- Validation error messages
- Form reset behavior
- Whitespace handling (trim inputs)

### Modal Components
**MUST test:**
- Open/close actions dispatched
- Form submission behavior
- Error display from store
- Cleanup on close

---

## Edge Cases to Always Test

### String Handling
- Empty strings: `""`
- Whitespace only: `"   "`, `"\t\n"`
- Leading/trailing whitespace: `"  text  "`
- Very long strings (100+ characters)
- Unicode/international characters: `"José García"`, `"李明"`
- Special characters: `"O'Brien"`, `"Smith-Jones"`

### Numbers
- Zero: `0`
- Negative numbers: `-1`, `-100`
- Large numbers: `99999`, `Number.MAX_SAFE_INTEGER`
- Decimals (if applicable): `0.1`, `-0.5`

### Arrays
- Empty array: `[]`
- Single item: `[item]`
- Multiple items: `[item1, item2, item3]`
- Large arrays (1000+ items for performance tests)

### Null/Undefined
- `null` values
- `undefined` values
- Missing properties

### State Transitions
- Initial state → first action
- Multiple actions in sequence
- State reset/cleanup

---

## Code Conventions

### TypeScript
- Use **strict mode** (already configured)
- Define interfaces for all data structures
- Avoid `any` type (use `unknown` if needed)
- Use readonly for immutable data

### Angular Style
- Follow [Angular Style Guide](https://angular.dev/style-guide)
- Use standalone components (no NgModules)
- Prefer `inject()` over constructor injection
- Use `@if` and `@for` control flow (not `*ngIf`/`*ngFor`)

### File Structure
```
src/app/
├── components/
│   ├── feature/
│   │   ├── feature.ts
│   │   ├── feature.spec.ts
│   │   ├── feature.html
│   │   └── feature.scss
├── store/
│   ├── actions/
│   │   └── feature.actions.ts
│   ├── reducers/
│   │   ├── feature.reducer.ts
│   │   └── feature.reducer.spec.ts
│   ├── effects/
│   │   ├── feature.effects.ts
│   │   └── feature.effects.spec.ts
│   └── selectors/
│       ├── feature.selectors.ts
│       └── feature.selectors.spec.ts
```

---

## Commands

### Development
- `npm start` - Start dev server (http://localhost:4200)
- `npm run build` - Production build
- `npm run watch` - Build with watch mode

### Testing
- `npm test` - Run tests in watch mode
- `npm test -- --watch=false` - Run tests once
- `npm test -- --code-coverage` - Generate coverage report

---

## Project-Specific Guidelines

### State Management
- All state changes MUST go through actions/reducers
- No direct state mutation
- Use selectors for all state access (never access state directly)
- Effects for all side effects (API calls, validation, etc.)

### Component Design
- Keep components thin - delegate logic to store
- Components should only dispatch actions and subscribe to selectors
- Business logic belongs in effects or services, not components
- Use `OnPush` change detection (already using standalone components)

### Naming Conventions
- Actions: `[Source] Action Description` (e.g., `[Users] Load Users Success`)
- Reducers: `featureReducer` (e.g., `usersReducer`)
- Selectors: `selectFeature` (e.g., `selectAllUsers`, `selectUserById`)
- Effects: `actionName$` (e.g., `loadUsers$`, `validateAndAddUser$`)

---

## Common Patterns

### Adding a New Feature with NgRx

1. **Write Tests First (TDD):**
   ```typescript
   // 1. Action tests
   describe('Feature Actions', () => { ... });

   // 2. Reducer tests (test all state mutations)
   describe('Feature Reducer', () => { ... });

   // 3. Selector tests (test state selection)
   describe('Feature Selectors', () => { ... });

   // 4. Effect tests (test async operations)
   describe('Feature Effects', () => { ... });

   // 5. Component tests (test UI integration)
   describe('FeatureComponent', () => { ... });
   ```

2. **Run Tests - Verify Failures**

3. **Implement in Order:**
   - Actions (define what can happen)
   - Reducer (define how state changes)
   - Selectors (define how to read state)
   - Effects (define side effects, if needed)
   - Component (define UI)

4. **Refactor & Commit**

### Form Validation Pattern
```typescript
onSubmit() {
  // Always trim user input
  if (this.name.trim() && this.email.trim()) {
    this.store.dispatch(submitForm({
      data: {
        name: this.name.trim(),
        email: this.email.trim()
      }
    }));
  }
}
```

### Error Handling Pattern
- Store errors in state
- Display errors in UI via selectors
- Clear errors on user actions (e.g., typing in field)
- Never use `alert()` or `console.error()` in production

---

## Quality Checklist

Before marking a feature complete, verify:

- [ ] All tests written BEFORE implementation
- [ ] All tests passing
- [ ] Coverage ≥ 95% for new code
- [ ] Edge cases tested (empty, null, unicode, etc.)
- [ ] Immutability verified in reducer tests
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console.log statements
- [ ] Meaningful commit message
- [ ] Code follows Angular style guide

---

## Important Reminders

- **Tests are not optional** - they are part of the feature
- **Write tests first** - this is non-negotiable for TDD
- **Test the behavior, not the implementation** - focus on inputs/outputs
- **One assertion per concept** - but multiple assertions per test are fine
- **Make tests readable** - future developers should understand intent
- **Mock external dependencies** - tests should be fast and isolated

---

## When You're Unsure

If you're unsure whether to write tests for something, **write tests**.
If you're unsure what type of test to write, **ask the user**.
If you're unsure if TDD applies, **it does**.

---

*This file should be updated as patterns emerge and the project evolves.*
