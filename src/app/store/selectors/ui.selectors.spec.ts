import {
  selectUIState,
  selectShowAddUserModal,
  selectModalError,
  selectShowCounterModal,
  selectDarkMode
} from './ui.selectors';
import { UIState } from '../models/app-state.model';

describe('UI Selectors', () => {
  describe('selectUIState', () => {
    it('should select the UI state', () => {
      const uiState: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };
      const state = {
        ui: uiState,
        counter: { count: 0 },
        users: { users: [], loading: false, error: null }
      };

      const result = selectUIState(state);
      expect(result).toBe(uiState);
    });
  });

  describe('selectShowAddUserModal', () => {
    it('should select showAddUserModal as false', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectShowAddUserModal.projector(state);
      expect(result).toBe(false);
    });

    it('should select showAddUserModal as true', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectShowAddUserModal.projector(state);
      expect(result).toBe(true);
    });

    it('should select modal state independently of error', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Some error',
        showCounterModal: false,
        darkMode: false
      };

      const result = selectShowAddUserModal.projector(state);
      expect(result).toBe(true);
    });

    it('should select modal state independently of other modals', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: null,
        showCounterModal: true,
        darkMode: false
      };

      const result = selectShowAddUserModal.projector(state);
      expect(result).toBe(true);
    });
  });

  describe('selectModalError', () => {
    it('should select null error', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectModalError.projector(state);
      expect(result).toBe(null);
    });

    it('should select error message', () => {
      const errorMessage = 'Email already exists';
      const state: UIState = {
        showAddUserModal: true,
        modalError: errorMessage,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectModalError.projector(state);
      expect(result).toBe(errorMessage);
    });

    it('should select empty string error', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: '',
        showCounterModal: false,
        darkMode: false
      };

      const result = selectModalError.projector(state);
      expect(result).toBe('');
    });

    it('should select error independently of modal visibility', () => {
      const errorMessage = 'Validation error';
      const state: UIState = {
        showAddUserModal: false,
        modalError: errorMessage,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectModalError.projector(state);
      expect(result).toBe(errorMessage);
    });

    it('should select long error message', () => {
      const longError = 'This is a very long error message that describes what went wrong in detail';
      const state: UIState = {
        showAddUserModal: true,
        modalError: longError,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectModalError.projector(state);
      expect(result).toBe(longError);
    });
  });

  describe('selectShowCounterModal', () => {
    it('should select showCounterModal as false', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectShowCounterModal.projector(state);
      expect(result).toBe(false);
    });

    it('should select showCounterModal as true', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: true,
        darkMode: false
      };

      const result = selectShowCounterModal.projector(state);
      expect(result).toBe(true);
    });

    it('should select counter modal independently of add user modal', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectShowCounterModal.projector(state);
      expect(result).toBe(false);
    });

    it('should select counter modal when both modals are open', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: null,
        showCounterModal: true,
        darkMode: false
      };

      const result = selectShowCounterModal.projector(state);
      expect(result).toBe(true);
    });
  });

  describe('selectDarkMode', () => {
    it('should select darkMode as false', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const result = selectDarkMode.projector(state);
      expect(result).toBe(false);
    });

    it('should select darkMode as true', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: true
      };

      const result = selectDarkMode.projector(state);
      expect(result).toBe(true);
    });

    it('should select darkMode independently of modals', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Error',
        showCounterModal: true,
        darkMode: true
      };

      const result = selectDarkMode.projector(state);
      expect(result).toBe(true);
    });

    it('should select darkMode independently of errors', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: 'Some error',
        showCounterModal: false,
        darkMode: true
      };

      const result = selectDarkMode.projector(state);
      expect(result).toBe(true);
    });
  });

  describe('selector composition', () => {
    it('should work together to provide complete UI state', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Validation error',
        showCounterModal: false,
        darkMode: true
      };

      const showAddUserModal = selectShowAddUserModal.projector(state);
      const modalError = selectModalError.projector(state);
      const showCounterModal = selectShowCounterModal.projector(state);
      const darkMode = selectDarkMode.projector(state);

      expect(showAddUserModal).toBe(true);
      expect(modalError).toBe('Validation error');
      expect(showCounterModal).toBe(false);
      expect(darkMode).toBe(true);
    });

    it('should reflect initial state', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const showAddUserModal = selectShowAddUserModal.projector(state);
      const modalError = selectModalError.projector(state);
      const showCounterModal = selectShowCounterModal.projector(state);
      const darkMode = selectDarkMode.projector(state);

      expect(showAddUserModal).toBe(false);
      expect(modalError).toBe(null);
      expect(showCounterModal).toBe(false);
      expect(darkMode).toBe(false);
    });

    it('should handle both modals being open', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: null,
        showCounterModal: true,
        darkMode: false
      };

      const showAddUserModal = selectShowAddUserModal.projector(state);
      const showCounterModal = selectShowCounterModal.projector(state);

      expect(showAddUserModal).toBe(true);
      expect(showCounterModal).toBe(true);
    });

    it('should handle error with modal closed', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: 'Error persists',
        showCounterModal: false,
        darkMode: false
      };

      const showAddUserModal = selectShowAddUserModal.projector(state);
      const modalError = selectModalError.projector(state);

      expect(showAddUserModal).toBe(false);
      expect(modalError).toBe('Error persists');
    });
  });

  describe('edge cases', () => {
    it('should handle all true boolean values', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Error',
        showCounterModal: true,
        darkMode: true
      };

      expect(selectShowAddUserModal.projector(state)).toBe(true);
      expect(selectShowCounterModal.projector(state)).toBe(true);
      expect(selectDarkMode.projector(state)).toBe(true);
    });

    it('should handle all false boolean values', () => {
      const state: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      expect(selectShowAddUserModal.projector(state)).toBe(false);
      expect(selectShowCounterModal.projector(state)).toBe(false);
      expect(selectDarkMode.projector(state)).toBe(false);
    });

    it('should handle error with special characters', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Error: Invalid input! @#$%',
        showCounterModal: false,
        darkMode: false
      };

      expect(selectModalError.projector(state)).toBe('Error: Invalid input! @#$%');
    });

    it('should handle HTML in error message', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: '<script>alert("test")</script>',
        showCounterModal: false,
        darkMode: false
      };

      expect(selectModalError.projector(state)).toBe('<script>alert("test")</script>');
    });

    it('should handle multiline error message', () => {
      const state: UIState = {
        showAddUserModal: true,
        modalError: 'Line 1\nLine 2\nLine 3',
        showCounterModal: false,
        darkMode: false
      };

      expect(selectModalError.projector(state)).toBe('Line 1\nLine 2\nLine 3');
    });
  });

  describe('state transitions', () => {
    it('should reflect modal opening', () => {
      const closedState: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const openState: UIState = {
        ...closedState,
        showAddUserModal: true
      };

      expect(selectShowAddUserModal.projector(closedState)).toBe(false);
      expect(selectShowAddUserModal.projector(openState)).toBe(true);
    });

    it('should reflect error being set and cleared', () => {
      const noErrorState: UIState = {
        showAddUserModal: true,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const errorState: UIState = {
        ...noErrorState,
        modalError: 'Error occurred'
      };

      const clearedState: UIState = {
        ...errorState,
        modalError: null
      };

      expect(selectModalError.projector(noErrorState)).toBe(null);
      expect(selectModalError.projector(errorState)).toBe('Error occurred');
      expect(selectModalError.projector(clearedState)).toBe(null);
    });

    it('should reflect dark mode toggle', () => {
      const lightState: UIState = {
        showAddUserModal: false,
        modalError: null,
        showCounterModal: false,
        darkMode: false
      };

      const darkState: UIState = {
        ...lightState,
        darkMode: true
      };

      expect(selectDarkMode.projector(lightState)).toBe(false);
      expect(selectDarkMode.projector(darkState)).toBe(true);
    });
  });
});
