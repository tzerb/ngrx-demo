import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../models/app-state.model';
import { counterReducer } from './counter.reducer';
import { usersReducer } from './users.reducer';
import { uiReducer } from './ui.reducer';

export const reducers: ActionReducerMap<AppState> = {
  counter: counterReducer,
  users: usersReducer,
  ui: uiReducer
};
