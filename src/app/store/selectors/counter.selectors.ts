import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CounterState } from '../models/app-state.model';

export const selectCounterState = createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
  selectCounterState,
  (state: CounterState) => state.count
);

export const selectIsPositive = createSelector(
  selectCount,
  (count: number) => count > 0
);

export const selectIsEven = createSelector(
  selectCount,
  (count: number) => count % 2 === 0
);
