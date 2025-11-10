import { User } from './user.model';

export interface AppState {
  counter: CounterState;
  users: UsersState;
  ui: UIState;
}

export interface CounterState {
  count: number;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface UIState {
  showAddUserModal: boolean;
  modalError: string | null;
  showCounterModal: boolean;
  darkMode: boolean;
}
