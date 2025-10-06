import { createReducer, on } from '@ngrx/store';
import { UIState } from '../models/app-state.model';
import * as UIActions from '../actions/ui.actions';

export const initialState: UIState = {
  showAddUserModal: false,
  modalError: null,
  showCounterModal: false
};

export const uiReducer = createReducer(
  initialState,
  on(UIActions.openAddUserModal, (state) => ({
    ...state,
    showAddUserModal: true,
    modalError: null
  })),
  on(UIActions.closeAddUserModal, (state) => ({
    ...state,
    showAddUserModal: false,
    modalError: null
  })),
  on(UIActions.setModalError, (state, { error }) => ({
    ...state,
    modalError: error
  })),
  on(UIActions.clearModalError, (state) => ({
    ...state,
    modalError: null
  })),
  on(UIActions.openCounterModal, (state) => ({
    ...state,
    showCounterModal: true
  })),
  on(UIActions.closeCounterModal, (state) => ({
    ...state,
    showCounterModal: false
  }))
);
