import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LogState } from '../models/app-state.model';

export const selectLogState = createFeatureSelector<LogState>('log');

export const selectLogEntries = createSelector(
  selectLogState,
  (state: LogState) => state.entries
);

export const selectLogCount = createSelector(
  selectLogEntries,
  (entries) => entries.length
);
