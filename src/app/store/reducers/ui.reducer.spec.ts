import { uiReducer, initialState } from './ui.reducer';
import * as UIActions from '../actions/ui.actions';
import { UIState } from '../models/app-state.model';

describe('UIReducer', () => {
  describe('initialState', () => {
    it('should have all modals closed, no error, and dark mode off', () => {
      expect(initialState).toEqual({
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      });
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = uiReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('openAddUserModal action', () => {
    it('should set showAddUserModal to true', () => {
      const action = UIActions.openAddUserModal();
      const result = uiReducer(initialState, action);

      expect(result.showAddUserModal).toBe(true);
    });

    it('should clear modal error when opening', () => {
      const state: UIState = {
        ...initialState,
        modalError: 'Previous error'
      };
      const action = UIActions.openAddUserModal();
      const result = uiReducer(state, action);

      expect(result.showAddUserModal).toBe(true);
      expect(result.modalError).toBe(null);
    });

    it('should not affect other modal states', () => {
      const state: UIState = {
        ...initialState,
        showCounterModal: true,
        darkMode: true
      };
      const action = UIActions.openAddUserModal();
      const result = uiReducer(state, action);

      expect(result.showCounterModal).toBe(true);
      expect(result.darkMode).toBe(true);
    });

    it('should create a new state object (immutability)', () => {
      const state: UIState = { ...initialState };
      const action = UIActions.openAddUserModal();
      const result = uiReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('closeAddUserModal action', () => {
    it('should set showAddUserModal to false', () => {
      const state: UIState = {
        ...initialState,
        showAddUserModal: true
      };
      const action = UIActions.closeAddUserModal();
      const result = uiReducer(state, action);

      expect(result.showAddUserModal).toBe(false);
    });

    it('should clear modal error when closing', () => {
      const state: UIState = {
        ...initialState,
        showAddUserModal: true,
        modalError: 'Some error'
      };
      const action = UIActions.closeAddUserModal();
      const result = uiReducer(state, action);

      expect(result.showAddUserModal).toBe(false);
      expect(result.modalError).toBe(null);
    });

    it('should handle closing when already closed', () => {
      const action = UIActions.closeAddUserModal();
      const result = uiReducer(initialState, action);

      expect(result.showAddUserModal).toBe(false);
      expect(result.modalError).toBe(null);
    });

    it('should not affect other modal states', () => {
      const state: UIState = {
        ...initialState,
        showAddUserModal: true,
        showCounterModal: true
      };
      const action = UIActions.closeAddUserModal();
      const result = uiReducer(state, action);

      expect(result.showCounterModal).toBe(true);
    });

    it('should create a new state object (immutability)', () => {
      const state: UIState = { ...initialState, showAddUserModal: true };
      const action = UIActions.closeAddUserModal();
      const result = uiReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('setModalError action', () => {
    it('should set error message', () => {
      const errorMessage = 'Email already exists';
      const action = UIActions.setModalError({ error: errorMessage });
      const result = uiReducer(initialState, action);

      expect(result.modalError).toBe(errorMessage);
    });

    it('should replace existing error', () => {
      const state: UIState = {
        ...initialState,
        modalError: 'Old error'
      };
      const newError = 'New error';
      const action = UIActions.setModalError({ error: newError });
      const result = uiReducer(state, action);

      expect(result.modalError).toBe(newError);
    });

    it('should handle null error', () => {
      const state: UIState = {
        ...initialState,
        modalError: 'Some error'
      };
      const action = UIActions.setModalError({ error: null });
      const result = uiReducer(state, action);

      expect(result.modalError).toBe(null);
    });

    it('should not affect modal visibility states', () => {
      const state: UIState = {
        ...initialState,
        showAddUserModal: true,
        showCounterModal: true
      };
      const action = UIActions.setModalError({ error: 'Error' });
      const result = uiReducer(state, action);

      expect(result.showAddUserModal).toBe(true);
      expect(result.showCounterModal).toBe(true);
    });

    it('should create a new state object (immutability)', () => {
      const state: UIState = { ...initialState };
      const action = UIActions.setModalError({ error: 'Error' });
      const result = uiReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('clearModalError action', () => {
    it('should clear existing error', () => {
      const state: UIState = {
        ...initialState,
        modalError: 'Some error'
      };
      const action = UIActions.clearModalError();
      const result = uiReducer(state, action);

      expect(result.modalError).toBe(null);
    });

    it('should handle clearing when no error exists', () => {
      const action = UIActions.clearModalError();
      const result = uiReducer(initialState, action);

      expect(result.modalError).toBe(null);
    });

    it('should not affect other state properties', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Error',
        showCounterModal: true,
        darkMode: true
      };
      const action = UIActions.clearModalError();
      const result = uiReducer(state, action);

      expect(result.modalError).toBe(null);
      expect(result.showAddUserModal).toBe(true);
      expect(result.showCounterModal).toBe(true);
      expect(result.darkMode).toBe(true);
    });

    it('should create a new state object (immutability)', () => {
      const state: UIState = { ...initialState, modalError: 'Error' };
      const action = UIActions.clearModalError();
      const result = uiReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('openCounterModal action', () => {
    it('should set showCounterModal to true', () => {
      const action = UIActions.openCounterModal();
      const result = uiReducer(initialState, action);

      expect(result.showCounterModal).toBe(true);
    });

    it('should not affect other modal states', () => {
      const state: UIState = {
        ...initialState,
        showAddUserModal: true
      };
      const action = UIActions.openCounterModal();
      const result = uiReducer(state, action);

      expect(result.showCounterModal).toBe(true);
      expect(result.showAddUserModal).toBe(true);
    });

    it('should not clear modal error', () => {
      const state: UIState = {
        ...initialState,
        modalError: 'Some error'
      };
      const action = UIActions.openCounterModal();
      const result = uiReducer(state, action);

      expect(result.showCounterModal).toBe(true);
      expect(result.modalError).toBe('Some error');
    });

    it('should create a new state object (immutability)', () => {
      const state: UIState = { ...initialState };
      const action = UIActions.openCounterModal();
      const result = uiReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('closeCounterModal action', () => {
    it('should set showCounterModal to false', () => {
      const state: UIState = {
        ...initialState,
        showCounterModal: true
      };
      const action = UIActions.closeCounterModal();
      const result = uiReducer(state, action);

      expect(result.showCounterModal).toBe(false);
    });

    it('should handle closing when already closed', () => {
      const action = UIActions.closeCounterModal();
      const result = uiReducer(initialState, action);

      expect(result.showCounterModal).toBe(false);
    });

    it('should not affect other modal states', () => {
      const state: UIState = {
        ...initialState,
        showCounterModal: true,
        showAddUserModal: true
      };
      const action = UIActions.closeCounterModal();
      const result = uiReducer(state, action);

      expect(result.showCounterModal).toBe(false);
      expect(result.showAddUserModal).toBe(true);
    });

    it('should not clear modal error', () => {
      const state: UIState = {
        ...initialState,
        showCounterModal: true,
        modalError: 'Error'
      };
      const action = UIActions.closeCounterModal();
      const result = uiReducer(state, action);

      expect(result.modalError).toBe('Error');
    });

    it('should create a new state object (immutability)', () => {
      const state: UIState = { ...initialState, showCounterModal: true };
      const action = UIActions.closeCounterModal();
      const result = uiReducer(state, action);

      expect(result).not.toBe(state);
    });
  });

  describe('toggleDarkMode action', () => {
    it('should toggle dark mode from false to true', () => {
      const action = UIActions.toggleDarkMode();
      const result = uiReducer(initialState, action);

      expect(result.darkMode).toBe(true);
    });

    it('should toggle dark mode from true to false', () => {
      const state: UIState = {
        ...initialState,
        darkMode: true
      };
      const action = UIActions.toggleDarkMode();
      const result = uiReducer(state, action);

      expect(result.darkMode).toBe(false);
    });

    it('should toggle multiple times', () => {
      let state = initialState;

      state = uiReducer(state, UIActions.toggleDarkMode());
      expect(state.darkMode).toBe(true);

      state = uiReducer(state, UIActions.toggleDarkMode());
      expect(state.darkMode).toBe(false);

      state = uiReducer(state, UIActions.toggleDarkMode());
      expect(state.darkMode).toBe(true);
    });

    it('should not affect other state properties', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Error',
        showCounterModal: true,
        darkMode: false
      };
      const action = UIActions.toggleDarkMode();
      const result = uiReducer(state, action);

      expect(result.darkMode).toBe(true);
      expect(result.showAddUserModal).toBe(true);
      expect(result.modalError).toBe('Error');
      expect(result.showCounterModal).toBe(true);
    });

    it('should create a new state object (immutability)', () => {
      const state: UIState = { ...initialState };
      const action = UIActions.toggleDarkMode();
      const result = uiReducer(state, action);

      expect(result).not.toBe(state);
      expect(state.darkMode).toBe(false); // Original unchanged
    });
  });

  describe('complex UI flow scenarios', () => {
    it('should handle opening and closing add user modal with error', () => {
      let state = initialState;

      // Open modal
      state = uiReducer(state, UIActions.openAddUserModal());
      expect(state.showAddUserModal).toBe(true);
      expect(state.modalError).toBe(null);

      // Set error
      state = uiReducer(state, UIActions.setModalError({ error: 'Email exists' }));
      expect(state.modalError).toBe('Email exists');

      // Close modal (should clear error)
      state = uiReducer(state, UIActions.closeAddUserModal());
      expect(state.showAddUserModal).toBe(false);
      expect(state.modalError).toBe(null);
    });

    it('should handle both modals being open simultaneously', () => {
      let state = initialState;

      state = uiReducer(state, UIActions.openAddUserModal());
      expect(state.showAddUserModal).toBe(true);

      state = uiReducer(state, UIActions.openCounterModal());
      expect(state.showAddUserModal).toBe(true);
      expect(state.showCounterModal).toBe(true);
    });

    it('should handle error workflow in add user modal', () => {
      let state = initialState;

      // Open modal
      state = uiReducer(state, UIActions.openAddUserModal());

      // Set error
      state = uiReducer(state, UIActions.setModalError({ error: 'Invalid email' }));
      expect(state.modalError).toBe('Invalid email');

      // Clear error
      state = uiReducer(state, UIActions.clearModalError());
      expect(state.modalError).toBe(null);
      expect(state.showAddUserModal).toBe(true); // Modal still open

      // Set new error
      state = uiReducer(state, UIActions.setModalError({ error: 'Email exists' }));
      expect(state.modalError).toBe('Email exists');

      // Close modal (clears error)
      state = uiReducer(state, UIActions.closeAddUserModal());
      expect(state.modalError).toBe(null);
    });

    it('should handle complete UI state changes', () => {
      let state = initialState;

      // Enable dark mode
      state = uiReducer(state, UIActions.toggleDarkMode());
      expect(state.darkMode).toBe(true);

      // Open both modals
      state = uiReducer(state, UIActions.openAddUserModal());
      state = uiReducer(state, UIActions.openCounterModal());
      expect(state.showAddUserModal).toBe(true);
      expect(state.showCounterModal).toBe(true);

      // Add error
      state = uiReducer(state, UIActions.setModalError({ error: 'Error' }));

      // Verify all state
      expect(state).toEqual({
        showAddUserModal: true,
        modalError: 'Error',
        showCounterModal: true,
        darkMode: true
      });

      // Close everything
      state = uiReducer(state, UIActions.closeAddUserModal());
      state = uiReducer(state, UIActions.closeCounterModal());
      state = uiReducer(state, UIActions.toggleDarkMode());

      // Back to initial state
      expect(state).toEqual(initialState);
    });
  });
});
