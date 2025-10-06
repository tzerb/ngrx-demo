import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const loadUsers = createAction('[Users] Load Users');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

export const addUserRequest = createAction(
  '[Users] Add User Request',
  props<{ user: Omit<User, 'id'> }>()
);

export const addUser = createAction(
  '[Users] Add User',
  props<{ user: User }>()
);

export const updateUser = createAction(
  '[Users] Update User',
  props<{ user: User }>()
);

export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ id: number }>()
);
