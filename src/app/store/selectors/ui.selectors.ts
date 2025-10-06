import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UIState } from '../models/app-state.model';

export const selectUIState = createFeatureSelector<UIState>('ui');

export const selectShowAddUserModal = createSelector(
  selectUIState,
  (state: UIState) => state.showAddUserModal
);

export const selectModalError = createSelector(
  selectUIState,
  (state: UIState) => state.modalError
);

export const selectShowCounterModal = createSelector(
  selectUIState,
  (state: UIState) => state.showCounterModal
);
