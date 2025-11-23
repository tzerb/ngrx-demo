import { createReducer, on } from '@ngrx/store';
import { LogState, LogEntry } from '../models/app-state.model';
import * as LogActions from '../actions/log.actions';

export const initialState: LogState = {
  entries: []
};

export const logReducer = createReducer(
  initialState,
  on(LogActions.addLogEntry, (state, { message }) => {
    const newEntry: LogEntry = {
      id: state.entries.length > 0 ? Math.max(...state.entries.map(e => e.id)) + 1 : 1,
      message,
      timestamp: new Date()
    };
    return {
      ...state,
      entries: [...state.entries, newEntry]
    };
  }),
  on(LogActions.clearLog, (state) => ({
    ...state,
    entries: []
  }))
);
