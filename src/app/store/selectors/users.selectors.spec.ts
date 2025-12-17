import {
  selectUsersState,
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
  selectUserById,
  selectUsersCount
} from './users.selectors';
import { UsersState } from '../models/app-state.model';
import { User } from '../models/user.model';

describe('Users Selectors', () => {
  const mockUser1: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
  const mockUser2: User = { id: 2, name: 'Jane Smith', email: 'jane@example.com' };
  const mockUser3: User = { id: 3, name: 'Bob Johnson', email: 'bob@example.com' };

  describe('selectUsersState', () => {
    it('should select the users state', () => {
      const usersState: UsersState = {
        users: [mockUser1],
        loading: false,
        error: null
      };
      const state = {
        users: usersState,
        counter: { count: 0 },
        ui: { showAddUserModal: false, modalError: null, showCounterModal: false, darkMode: false }
      };

      const result = selectUsersState(state);
      expect(result).toBe(usersState);
    });
  });

  describe('selectAllUsers', () => {
    it('should select all users from state', () => {
      const users = [mockUser1, mockUser2];
      const state: UsersState = {
        users,
        loading: false,
        error: null
      };

      const result = selectAllUsers.projector(state);
      expect(result).toBe(users);
      expect(result.length).toBe(2);
    });

    it('should select empty array when no users', () => {
      const state: UsersState = {
        users: [],
        loading: false,
        error: null
      };

      const result = selectAllUsers.projector(state);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should select single user', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: false,
        error: null
      };

      const result = selectAllUsers.projector(state);
      expect(result).toEqual([mockUser1]);
      expect(result.length).toBe(1);
    });

    it('should select multiple users', () => {
      const users = [mockUser1, mockUser2, mockUser3];
      const state: UsersState = {
        users,
        loading: false,
        error: null
      };

      const result = selectAllUsers.projector(state);
      expect(result).toEqual(users);
      expect(result.length).toBe(3);
    });
  });

  describe('selectUsersLoading', () => {
    it('should select loading as true', () => {
      const state: UsersState = {
        users: [],
        loading: true,
        error: null
      };

      const result = selectUsersLoading.projector(state);
      expect(result).toBe(true);
    });

    it('should select loading as false', () => {
      const state: UsersState = {
        users: [],
        loading: false,
        error: null
      };

      const result = selectUsersLoading.projector(state);
      expect(result).toBe(false);
    });

    it('should select loading state when users exist', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: true,
        error: null
      };

      const result = selectUsersLoading.projector(state);
      expect(result).toBe(true);
    });
  });

  describe('selectUsersError', () => {
    it('should select null error', () => {
      const state: UsersState = {
        users: [],
        loading: false,
        error: null
      };

      const result = selectUsersError.projector(state);
      expect(result).toBe(null);
    });

    it('should select error message', () => {
      const errorMessage = 'Failed to load users';
      const state: UsersState = {
        users: [],
        loading: false,
        error: errorMessage
      };

      const result = selectUsersError.projector(state);
      expect(result).toBe(errorMessage);
    });

    it('should select error when users exist', () => {
      const errorMessage = 'Network error';
      const state: UsersState = {
        users: [mockUser1, mockUser2],
        loading: false,
        error: errorMessage
      };

      const result = selectUsersError.projector(state);
      expect(result).toBe(errorMessage);
    });

    it('should handle empty error string', () => {
      const state: UsersState = {
        users: [],
        loading: false,
        error: ''
      };

      const result = selectUsersError.projector(state);
      expect(result).toBe('');
    });
  });

  describe('selectUserById', () => {
    const users = [mockUser1, mockUser2, mockUser3];

    it('should select user by existing id', () => {
      const selector = selectUserById(2);
      const result = selector.projector(users);

      expect(result).toEqual(mockUser2);
    });

    it('should select first user by id', () => {
      const selector = selectUserById(1);
      const result = selector.projector(users);

      expect(result).toEqual(mockUser1);
    });

    it('should select last user by id', () => {
      const selector = selectUserById(3);
      const result = selector.projector(users);

      expect(result).toEqual(mockUser3);
    });

    it('should return undefined for non-existent id', () => {
      const selector = selectUserById(999);
      const result = selector.projector(users);

      expect(result).toBeUndefined();
    });

    it('should return undefined when users array is empty', () => {
      const selector = selectUserById(1);
      const result = selector.projector([]);

      expect(result).toBeUndefined();
    });

    it('should return undefined for negative id', () => {
      const selector = selectUserById(-1);
      const result = selector.projector(users);

      expect(result).toBeUndefined();
    });

    it('should return undefined for zero id', () => {
      const selector = selectUserById(0);
      const result = selector.projector(users);

      expect(result).toBeUndefined();
    });

    it('should select correct user from large array', () => {
      const largeUserArray = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));

      const selector = selectUserById(50);
      const result = selector.projector(largeUserArray);

      expect(result).toEqual({
        id: 50,
        name: 'User 50',
        email: 'user50@example.com'
      });
    });

    it('should create different selector instances for different ids', () => {
      const selector1 = selectUserById(1);
      const selector2 = selectUserById(2);

      expect(selector1).not.toBe(selector2);
    });
  });

  describe('selectUsersCount', () => {
    it('should return count of 0 for empty array', () => {
      const result = selectUsersCount.projector([]);
      expect(result).toBe(0);
    });

    it('should return count of 1 for single user', () => {
      const result = selectUsersCount.projector([mockUser1]);
      expect(result).toBe(1);
    });

    it('should return count of 2 for two users', () => {
      const result = selectUsersCount.projector([mockUser1, mockUser2]);
      expect(result).toBe(2);
    });

    it('should return count of 3 for three users', () => {
      const result = selectUsersCount.projector([mockUser1, mockUser2, mockUser3]);
      expect(result).toBe(3);
    });

    it('should return correct count for large array', () => {
      const largeUserArray = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));

      const result = selectUsersCount.projector(largeUserArray);
      expect(result).toBe(100);
    });
  });

  describe('selector composition', () => {
    it('should work together to provide complete user state', () => {
      const users = [mockUser1, mockUser2];
      const state: UsersState = {
        users,
        loading: false,
        error: null
      };

      const allUsers = selectAllUsers.projector(state);
      const loading = selectUsersLoading.projector(state);
      const error = selectUsersError.projector(state);
      const count = selectUsersCount.projector(allUsers);
      const specificUser = selectUserById(1).projector(allUsers);

      expect(allUsers).toEqual(users);
      expect(loading).toBe(false);
      expect(error).toBe(null);
      expect(count).toBe(2);
      expect(specificUser).toEqual(mockUser1);
    });

    it('should reflect loading state', () => {
      const state: UsersState = {
        users: [],
        loading: true,
        error: null
      };

      const allUsers = selectAllUsers.projector(state);
      const loading = selectUsersLoading.projector(state);
      const count = selectUsersCount.projector(allUsers);

      expect(allUsers).toEqual([]);
      expect(loading).toBe(true);
      expect(count).toBe(0);
    });

    it('should reflect error state', () => {
      const state: UsersState = {
        users: [mockUser1],
        loading: false,
        error: 'Failed to load users'
      };

      const allUsers = selectAllUsers.projector(state);
      const loading = selectUsersLoading.projector(state);
      const error = selectUsersError.projector(state);
      const count = selectUsersCount.projector(allUsers);

      expect(allUsers).toEqual([mockUser1]);
      expect(loading).toBe(false);
      expect(error).toBe('Failed to load users');
      expect(count).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle users with duplicate names but different ids', () => {
      const duplicateNameUsers = [
        { id: 1, name: 'John Doe', email: 'john1@example.com' },
        { id: 2, name: 'John Doe', email: 'john2@example.com' }
      ];

      const selector1 = selectUserById(1);
      const selector2 = selectUserById(2);

      expect(selector1.projector(duplicateNameUsers)).toEqual(duplicateNameUsers[0]);
      expect(selector2.projector(duplicateNameUsers)).toEqual(duplicateNameUsers[1]);
    });

    it('should handle users with special characters in names', () => {
      const specialUsers = [
        { id: 1, name: "O'Brien", email: 'obrien@example.com' },
        { id: 2, name: 'José García', email: 'jose@example.com' }
      ];

      const count = selectUsersCount.projector(specialUsers);
      expect(count).toBe(2);

      const user = selectUserById(2).projector(specialUsers);
      expect(user?.name).toBe('José García');
    });

    it('should handle very long user arrays efficiently', () => {
      const hugeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));

      const count = selectUsersCount.projector(hugeArray);
      expect(count).toBe(10000);

      const user = selectUserById(5000).projector(hugeArray);
      expect(user?.id).toBe(5000);
    });
  });
});
