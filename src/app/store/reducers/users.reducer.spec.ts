import { usersReducer, initialState } from './users.reducer';
import * as UsersActions from '../actions/users.actions';
import { UsersState } from '../models/app-state.model';
import { User } from '../models/user.model';

describe('UsersReducer', () => {
  const mockUser1: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
  const mockUser2: User = { id: 2, name: 'Jane Smith', email: 'jane@example.com' };
  const mockUser3: User = { id: 3, name: 'Bob Johnson', email: 'bob@example.com' };

  describe('initialState', () => {
    it('should have empty users array, loading false, and no error', () => {
      expect(initialState).toEqual({
        users: [],
        loading: false,
        error: null
      });
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = usersReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadUsers action', () => {
    it('should set loading to true and clear error', () => {
      const action = UsersActions.loadUsers();
      const result = usersReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.users).toEqual([]);
    });

    it('should clear previous error when loading', () => {
      const state: UsersState = {
        users: [],
        loading: false,
        error: 'Previous error'
      };
      const action = UsersActions.loadUsers();
      const result = usersReducer(state, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should maintain existing users while loading', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: false,
        error: null
      };
      const action = UsersActions.loadUsers();
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser1]);
      expect(result.loading).toBe(true);
    });

    it('should create a new state object (immutability)', () => {
      const state: UsersState = { ...initialState };
      const action = UsersActions.loadUsers();
      const result = usersReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('loadUsersSuccess action', () => {
    it('should populate users array and set loading to false', () => {
      const users = [mockUser1, mockUser2];
      const state: UsersState = {
        users: [],
        loading: true,
        error: null
      };
      const action = UsersActions.loadUsersSuccess({ users });
      const result = usersReducer(state, action);

      expect(result.users).toEqual(users);
      expect(result.loading).toBe(false);
      expect(result.error).toBe(null);
    });

    it('should replace existing users with new users', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: true,
        error: null
      };
      const newUsers = [mockUser2, mockUser3];
      const action = UsersActions.loadUsersSuccess({ users: newUsers });
      const result = usersReducer(state, action);

      expect(result.users).toEqual(newUsers);
      expect(result.users.length).toBe(2);
    });

    it('should handle empty users array', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: true,
        error: null
      };
      const action = UsersActions.loadUsersSuccess({ users: [] });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([]);
      expect(result.loading).toBe(false);
    });

    it('should clear previous error on success', () => {
      const state: UsersState = {
        users: [],
        loading: true,
        error: 'Previous error'
      };
      const action = UsersActions.loadUsersSuccess({ users: [mockUser1] });
      const result = usersReducer(state, action);

      expect(result.error).toBe(null);
    });

    it('should create a new state object (immutability)', () => {
      const state: UsersState = { ...initialState, loading: true };
      const action = UsersActions.loadUsersSuccess({ users: [mockUser1] });
      const result = usersReducer(state, action);

      expect(result).not.toBe(state);
      expect(result.users).not.toBe(state.users);
    });
  });

  describe('loadUsersFailure action', () => {
    it('should set error and stop loading', () => {
      const state: UsersState = {
        users: [],
        loading: true,
        error: null
      };
      const errorMessage = 'Failed to load users';
      const action = UsersActions.loadUsersFailure({ error: errorMessage });
      const result = usersReducer(state, action);

      expect(result.error).toBe(errorMessage);
      expect(result.loading).toBe(false);
      expect(result.users).toEqual([]);
    });

    it('should maintain existing users on error', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: true,
        error: null
      };
      const action = UsersActions.loadUsersFailure({ error: 'Network error' });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser1, mockUser2]);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should create a new state object (immutability)', () => {
      const state: UsersState = { ...initialState, loading: true };
      const action = UsersActions.loadUsersFailure({ error: 'Error' });
      const result = usersReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('addUser action', () => {
    it('should add user to empty array', () => {
      const action = UsersActions.addUser({ user: mockUser1 });
      const result = usersReducer(initialState, action);

      expect(result.users).toEqual([mockUser1]);
      expect(result.users.length).toBe(1);
    });

    it('should append user to existing users', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const action = UsersActions.addUser({ user: mockUser3 });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser1, mockUser2, mockUser3]);
      expect(result.users.length).toBe(3);
    });

    it('should not modify existing users in array', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: false,
        error: null
      };
      const action = UsersActions.addUser({ user: mockUser2 });
      const result = usersReducer(state, action);

      expect(result.users[0]).toEqual(mockUser1);
      expect(result.users[1]).toEqual(mockUser2);
    });

    it('should create a new users array (immutability)', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: false,
        error: null
      };
      const action = UsersActions.addUser({ user: mockUser2 });
      const result = usersReducer(state, action);

      expect(result).not.toBe(state);
      expect(result.users).not.toBe(state.users);
      expect(state.users.length).toBe(1); // Original unchanged
    });

    it('should maintain loading and error state', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: true,
        error: 'Some error'
      };
      const action = UsersActions.addUser({ user: mockUser2 });
      const result = usersReducer(state, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBe('Some error');
    });
  });

  describe('updateUser action', () => {
    it('should update existing user by id', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2, mockUser3],
        loading: false,
        error: null
      };
      const updatedUser: User = { id: 2, name: 'Jane Updated', email: 'jane.updated@example.com' };
      const action = UsersActions.updateUser({ user: updatedUser });
      const result = usersReducer(state, action);

      expect(result.users[1]).toEqual(updatedUser);
      expect(result.users[0]).toEqual(mockUser1);
      expect(result.users[2]).toEqual(mockUser3);
      expect(result.users.length).toBe(3);
    });

    it('should not modify array if user id not found', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const nonExistentUser: User = { id: 999, name: 'Unknown', email: 'unknown@example.com' };
      const action = UsersActions.updateUser({ user: nonExistentUser });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser1, mockUser2]);
      expect(result.users.length).toBe(2);
    });

    it('should update first user in array', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const updatedUser: User = { id: 1, name: 'John Updated', email: 'john.new@example.com' };
      const action = UsersActions.updateUser({ user: updatedUser });
      const result = usersReducer(state, action);

      expect(result.users[0]).toEqual(updatedUser);
      expect(result.users[1]).toEqual(mockUser2);
    });

    it('should update last user in array', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const updatedUser: User = { id: 2, name: 'Jane Updated', email: 'jane.new@example.com' };
      const action = UsersActions.updateUser({ user: updatedUser });
      const result = usersReducer(state, action);

      expect(result.users[0]).toEqual(mockUser1);
      expect(result.users[1]).toEqual(updatedUser);
    });

    it('should create a new users array (immutability)', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const updatedUser: User = { ...mockUser1, name: 'Updated Name' };
      const action = UsersActions.updateUser({ user: updatedUser });
      const result = usersReducer(state, action);

      expect(result).not.toBe(state);
      expect(result.users).not.toBe(state.users);
      expect(state.users[0]).toEqual(mockUser1); // Original unchanged
    });
  });

  describe('deleteUser action', () => {
    it('should remove user by id', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2, mockUser3],
        loading: false,
        error: null
      };
      const action = UsersActions.deleteUser({ id: 2 });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser1, mockUser3]);
      expect(result.users.length).toBe(2);
    });

    it('should handle deleting first user', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const action = UsersActions.deleteUser({ id: 1 });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser2]);
      expect(result.users.length).toBe(1);
    });

    it('should handle deleting last user', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const action = UsersActions.deleteUser({ id: 2 });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser1]);
      expect(result.users.length).toBe(1);
    });

    it('should handle deleting only user', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: false,
        error: null
      };
      const action = UsersActions.deleteUser({ id: 1 });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([]);
      expect(result.users.length).toBe(0);
    });

    it('should not modify array if user id not found', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const action = UsersActions.deleteUser({ id: 999 });
      const result = usersReducer(state, action);

      expect(result.users).toEqual([mockUser1, mockUser2]);
      expect(result.users.length).toBe(2);
    });

    it('should create a new users array (immutability)', () => {
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: null
      };
      const action = UsersActions.deleteUser({ id: 1 });
      const result = usersReducer(state, action);

      expect(result).not.toBe(state);
      expect(result.users).not.toBe(state.users);
      expect(state.users.length).toBe(2); // Original unchanged
    });
  });

  describe('complex user flow scenarios', () => {
    it('should handle complete load -> success flow', () => {
      let state = initialState;

      // Start loading
      state = usersReducer(state, UsersActions.loadUsers());
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      // Load success
      state = usersReducer(state, UsersActions.loadUsersSuccess({ users: [mockUser1, mockUser2] }));
      expect(state.loading).toBe(false);
      expect(state.users).toEqual([mockUser1, mockUser2]);
    });

    it('should handle complete load -> failure flow', () => {
      let state = initialState;

      // Start loading
      state = usersReducer(state, UsersActions.loadUsers());
      expect(state.loading).toBe(true);

      // Load failure
      state = usersReducer(state, UsersActions.loadUsersFailure({ error: 'Network error' }));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.users).toEqual([]);
    });

    it('should handle CRUD operations in sequence', () => {
      let state = initialState;

      // Load users
      state = usersReducer(state, UsersActions.loadUsersSuccess({ users: [mockUser1, mockUser2] }));
      expect(state.users.length).toBe(2);

      // Add user
      state = usersReducer(state, UsersActions.addUser({ user: mockUser3 }));
      expect(state.users.length).toBe(3);

      // Update user
      const updatedUser: User = { id: 2, name: 'Jane Updated', email: 'jane.updated@example.com' };
      state = usersReducer(state, UsersActions.updateUser({ user: updatedUser }));
      expect(state.users[1]).toEqual(updatedUser);

      // Delete user
      state = usersReducer(state, UsersActions.deleteUser({ id: 1 }));
      expect(state.users.length).toBe(2);
      expect(state.users.find(u => u.id === 1)).toBeUndefined();
    });

    it('should handle retry after failure', () => {
      let state = initialState;

      // First attempt fails
      state = usersReducer(state, UsersActions.loadUsers());
      state = usersReducer(state, UsersActions.loadUsersFailure({ error: 'Network error' }));
      expect(state.error).toBe('Network error');

      // Retry clears error
      state = usersReducer(state, UsersActions.loadUsers());
      expect(state.error).toBe(null);
      expect(state.loading).toBe(true);

      // Success
      state = usersReducer(state, UsersActions.loadUsersSuccess({ users: [mockUser1] }));
      expect(state.error).toBe(null);
      expect(state.users).toEqual([mockUser1]);
    });
  });
});
