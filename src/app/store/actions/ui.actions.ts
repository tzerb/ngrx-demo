import { createAction, props } from '@ngrx/store';

export const openAddUserModal = createAction('[UI] Open Add User Modal');

export const closeAddUserModal = createAction('[UI] Close Add User Modal');

export const setModalError = createAction(
  '[UI] Set Modal Error',
  props<{ error: string | null }>()
);

export const clearModalError = createAction('[UI] Clear Modal Error');

export const openCounterModal = createAction('[UI] Open Counter Modal');

export const closeCounterModal = createAction('[UI] Close Counter Modal');

export const toggleDarkMode = createAction('[UI] Toggle Dark Mode');
