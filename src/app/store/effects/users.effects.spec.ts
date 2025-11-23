import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { UsersEffects } from './users.effects';
import * as UsersActions from '../actions/users.actions';
import * as UIActions from '../actions/ui.actions';
import { User } from '../models/user.model';
import { selectAllUsers } from '../selectors/users.selectors';

describe('UsersEffects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let store: MockStore;

  const mockUser1: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
  const mockUser2: User = { id: 2, name: 'Jane Smith', email: 'jane@example.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            users: {
              users: [],
              loading: false,
              error: null
            }
          }
        })
      ]
    });

    effects = TestBed.inject(UsersEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  describe('loadUsers$', () => {
    it('should return loadUsersSuccess action with mock users', (done) => {
      actions$ = of(UsersActions.loadUsers());

      effects.loadUsers$.subscribe(action => {
        expect(action).toEqual(
          UsersActions.loadUsersSuccess({
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ]
          })
        );
        done();
      });
    });

    it('should dispatch loadUsersSuccess with correct user data structure', (done) => {
      actions$ = of(UsersActions.loadUsers());

      effects.loadUsers$.subscribe(action => {
        if (action.type === '[Users] Load Users Success') {
          const successAction = action as ReturnType<typeof UsersActions.loadUsersSuccess>;
          expect(successAction.users).toBeDefined();
          expect(Array.isArray(successAction.users)).toBe(true);
          expect(successAction.users.length).toBe(2);
          expect(successAction.users[0]).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            name: jasmine.any(String),
            email: jasmine.any(String)
          }));
          done();
        }
      });
    });

    it('should handle multiple load requests independently', (done) => {
      actions$ = of(
        UsersActions.loadUsers(),
        UsersActions.loadUsers()
      );

      const results: Action[] = [];
      effects.loadUsers$.subscribe(action => {
        results.push(action);
        if (results.length === 2) {
          expect(results[0].type).toBe('[Users] Load Users Success');
          expect(results[1].type).toBe('[Users] Load Users Success');
          done();
        }
      });
    });
  });

  describe('validateAndAddUser$', () => {
    describe('successful user addition', () => {
      it('should add user with generated ID when email is unique', (done) => {
        const existingUsers = [mockUser1, mockUser2];
        store.overrideSelector(selectAllUsers, existingUsers);

        const newUserRequest = { name: 'Bob Johnson', email: 'bob@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: newUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            // First action should be addUser
            expect(results[0].type).toBe('[Users] Add User');
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user).toEqual({
              id: 3, // maxId (2) + 1
              name: 'Bob Johnson',
              email: 'bob@example.com'
            });

            // Second action should be closeAddUserModal
            expect(results[1].type).toBe('[UI] Close Add User Modal');
            done();
          }
        });
      });

      it('should generate ID 1 when no users exist', (done) => {
        store.overrideSelector(selectAllUsers, []);

        const newUserRequest = { name: 'First User', email: 'first@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: newUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user.id).toBe(1);
            expect(addAction.user.name).toBe('First User');
            expect(addAction.user.email).toBe('first@example.com');
            done();
          }
        });
      });

      it('should handle non-sequential existing IDs correctly', (done) => {
        const usersWithGaps = [
          { id: 1, name: 'User 1', email: 'user1@example.com' },
          { id: 5, name: 'User 5', email: 'user5@example.com' },
          { id: 3, name: 'User 3', email: 'user3@example.com' }
        ];
        store.overrideSelector(selectAllUsers, usersWithGaps);

        const newUserRequest = { name: 'New User', email: 'new@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: newUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user.id).toBe(6); // maxId (5) + 1
            done();
          }
        });
      });

      it('should close modal after successful addition', (done) => {
        store.overrideSelector(selectAllUsers, [mockUser1]);

        const newUserRequest = { name: 'New User', email: 'new@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: newUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            expect(results[1]).toEqual(UIActions.closeAddUserModal());
            done();
          }
        });
      });
    });

    describe('duplicate email validation', () => {
      it('should return error action when email already exists (exact match)', (done) => {
        const existingUsers = [mockUser1, mockUser2];
        store.overrideSelector(selectAllUsers, existingUsers);

        const duplicateUserRequest = { name: 'Duplicate', email: 'john@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: duplicateUserRequest }));

        effects.validateAndAddUser$.subscribe(action => {
          expect(action).toEqual(
            UIActions.setModalError({ error: 'A user with this email already exists' })
          );
          done();
        });
      });

      it('should return error when email exists with different case', (done) => {
        const existingUsers = [mockUser1];
        store.overrideSelector(selectAllUsers, existingUsers);

        const duplicateUserRequest = { name: 'Duplicate', email: 'JOHN@EXAMPLE.COM' };
        actions$ = of(UsersActions.addUserRequest({ user: duplicateUserRequest }));

        effects.validateAndAddUser$.subscribe(action => {
          expect(action).toEqual(
            UIActions.setModalError({ error: 'A user with this email already exists' })
          );
          done();
        });
      });

      it('should return error when email exists with mixed case', (done) => {
        const existingUsers = [mockUser1];
        store.overrideSelector(selectAllUsers, existingUsers);

        const duplicateUserRequest = { name: 'Duplicate', email: 'JoHn@ExAmPlE.cOm' };
        actions$ = of(UsersActions.addUserRequest({ user: duplicateUserRequest }));

        effects.validateAndAddUser$.subscribe(action => {
          expect(action).toEqual(
            UIActions.setModalError({ error: 'A user with this email already exists' })
          );
          done();
        });
      });

      it('should handle existing user email in uppercase', (done) => {
        const existingUsers = [
          { id: 1, name: 'John', email: 'JOHN@EXAMPLE.COM' }
        ];
        store.overrideSelector(selectAllUsers, existingUsers);

        const duplicateUserRequest = { name: 'Duplicate', email: 'john@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: duplicateUserRequest }));

        effects.validateAndAddUser$.subscribe(action => {
          expect(action.type).toBe('[UI] Set Modal Error');
          done();
        });
      });

      it('should not return error when email is unique', (done) => {
        const existingUsers = [mockUser1];
        store.overrideSelector(selectAllUsers, existingUsers);

        const uniqueUserRequest = { name: 'Unique User', email: 'unique@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: uniqueUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            expect(results[0].type).toBe('[Users] Add User');
            expect(results[1].type).toBe('[UI] Close Add User Modal');
            expect(results.some(a => a.type === '[UI] Set Modal Error')).toBe(false);
            done();
          }
        });
      });

      it('should only return error action (no add or close) when duplicate detected', (done) => {
        store.overrideSelector(selectAllUsers, [mockUser1]);

        const duplicateUserRequest = { name: 'Duplicate', email: 'john@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: duplicateUserRequest }));

        const results: Action[] = [];
        const subscription = effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
        });

        setTimeout(() => {
          expect(results.length).toBe(1);
          expect(results[0].type).toBe('[UI] Set Modal Error');
          subscription.unsubscribe();
          done();
        }, 100);
      });
    });

    describe('edge cases', () => {
      it('should handle empty name', (done) => {
        store.overrideSelector(selectAllUsers, []);

        const userRequest = { name: '', email: 'empty@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: userRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user.name).toBe('');
            done();
          }
        });
      });

      it('should handle special characters in email', (done) => {
        store.overrideSelector(selectAllUsers, []);

        const userRequest = { name: 'Test User', email: 'test+tag@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: userRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user.email).toBe('test+tag@example.com');
            done();
          }
        });
      });

      it('should handle very long user names', (done) => {
        store.overrideSelector(selectAllUsers, []);

        const longName = 'A'.repeat(100);
        const userRequest = { name: longName, email: 'long@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: userRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user.name).toBe(longName);
            done();
          }
        });
      });

      it('should handle adding multiple users in sequence', (done) => {
        store.overrideSelector(selectAllUsers, [mockUser1]);

        const user1Request = { name: 'User A', email: 'a@example.com' };
        const user2Request = { name: 'User B', email: 'b@example.com' };

        actions$ = of(
          UsersActions.addUserRequest({ user: user1Request }),
          UsersActions.addUserRequest({ user: user2Request })
        );

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 4) {
            // Two addUser actions
            expect(results.filter(a => a.type === '[Users] Add User').length).toBe(2);
            // Two closeModal actions
            expect(results.filter(a => a.type === '[UI] Close Add User Modal').length).toBe(2);
            done();
          }
        });
      });
    });

    describe('ID generation logic', () => {
      it('should generate correct ID with single existing user', (done) => {
        store.overrideSelector(selectAllUsers, [{ id: 10, name: 'User', email: 'user@example.com' }]);

        const newUserRequest = { name: 'New User', email: 'new@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: newUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user.id).toBe(11);
            done();
          }
        });
      });

      it('should generate correct ID with large existing ID', (done) => {
        store.overrideSelector(selectAllUsers, [
          { id: 9999, name: 'User', email: 'user@example.com' }
        ]);

        const newUserRequest = { name: 'New User', email: 'new@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: newUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user.id).toBe(10000);
            done();
          }
        });
      });

      it('should preserve other user properties', (done) => {
        store.overrideSelector(selectAllUsers, [mockUser1]);

        const newUserRequest = { name: 'Bob Johnson', email: 'bob@example.com' };
        actions$ = of(UsersActions.addUserRequest({ user: newUserRequest }));

        const results: Action[] = [];
        effects.validateAndAddUser$.subscribe(action => {
          results.push(action);
          if (results.length === 2) {
            const addAction = results[0] as ReturnType<typeof UsersActions.addUser>;
            expect(addAction.user).toEqual({
              id: jasmine.any(Number),
              name: newUserRequest.name,
              email: newUserRequest.email
            });
            done();
          }
        });
      });
    });
  });
});
