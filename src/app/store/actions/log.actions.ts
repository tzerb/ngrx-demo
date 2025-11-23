import { createAction, props } from '@ngrx/store';

export const addLogEntry = createAction(
  '[Log] Add Entry',
  props<{ message: string }>()
);

export const clearLog = createAction('[Log] Clear Log');
