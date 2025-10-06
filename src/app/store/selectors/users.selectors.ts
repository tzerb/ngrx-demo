import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from '../models/app-state.model';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.users
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state: UsersState) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state: UsersState) => state.error
);

export const selectUserById = (id: number) => createSelector(
  selectAllUsers,
  (users) => users.find(user => user.id === id)
);

export const selectUsersCount = createSelector(
  selectAllUsers,
  (users) => users.length
);
