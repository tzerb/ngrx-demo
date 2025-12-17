import { counterReducer, initialState } from './counter.reducer';
import * as CounterActions from '../actions/counter.actions';
import { CounterState } from '../models/app-state.model';

describe('CounterReducer', () => {
  describe('initialState', () => {
    it('should have initial count of 0', () => {
      expect(initialState).toEqual({ count: 0 });
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = counterReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('increment action', () => {
    it('should increment count by 1', () => {
      const action = CounterActions.increment();
      const result = counterReducer(initialState, action);

      expect(result.count).toBe(1);
    });

    it('should increment from current count', () => {
      const state: CounterState = { count: 5 };
      const action = CounterActions.increment();
      const result = counterReducer(state, action);

      expect(result.count).toBe(6);
    });

    it('should handle negative numbers', () => {
      const state: CounterState = { count: -3 };
      const action = CounterActions.increment();
      const result = counterReducer(state, action);

      expect(result.count).toBe(-2);
    });

    it('should create a new state object (immutability)', () => {
      const state: CounterState = { count: 5 };
      const action = CounterActions.increment();
      const result = counterReducer(state, action);

      expect(result).not.toBe(state);
      expect(state.count).toBe(5); // Original state unchanged
    });
  });

  describe('decrement action', () => {
    it('should decrement count by 1', () => {
      const state: CounterState = { count: 5 };
      const action = CounterActions.decrement();
      const result = counterReducer(state, action);

      expect(result.count).toBe(4);
    });

    it('should allow negative numbers', () => {
      const state: CounterState = { count: 0 };
      const action = CounterActions.decrement();
      const result = counterReducer(state, action);

      expect(result.count).toBe(-1);
    });

    it('should decrement from negative numbers', () => {
      const state: CounterState = { count: -2 };
      const action = CounterActions.decrement();
      const result = counterReducer(state, action);

      expect(result.count).toBe(-3);
    });

    it('should create a new state object (immutability)', () => {
      const state: CounterState = { count: 5 };
      const action = CounterActions.decrement();
      const result = counterReducer(state, action);

      expect(result).not.toBe(state);
      expect(state.count).toBe(5); // Original state unchanged
    });
  });

  describe('reset action', () => {
    it('should reset count to 0 from positive number', () => {
      const state: CounterState = { count: 42 };
      const action = CounterActions.reset();
      const result = counterReducer(state, action);

      expect(result.count).toBe(0);
    });

    it('should reset count to 0 from negative number', () => {
      const state: CounterState = { count: -15 };
      const action = CounterActions.reset();
      const result = counterReducer(state, action);

      expect(result.count).toBe(0);
    });

    it('should maintain count at 0 if already 0', () => {
      const state: CounterState = { count: 0 };
      const action = CounterActions.reset();
      const result = counterReducer(state, action);

      expect(result.count).toBe(0);
    });

    it('should create a new state object (immutability)', () => {
      const state: CounterState = { count: 100 };
      const action = CounterActions.reset();
      const result = counterReducer(state, action);

      expect(result).not.toBe(state);
      expect(state.count).toBe(100); // Original state unchanged
    });
  });

  describe('incrementByAmount action', () => {
    it('should increment by specified amount', () => {
      const state: CounterState = { count: 10 };
      const action = CounterActions.incrementByAmount({ amount: 5 });
      const result = counterReducer(state, action);

      expect(result.count).toBe(15);
    });

    it('should handle negative amounts (decrement)', () => {
      const state: CounterState = { count: 20 };
      const action = CounterActions.incrementByAmount({ amount: -7 });
      const result = counterReducer(state, action);

      expect(result.count).toBe(13);
    });

    it('should handle zero amount', () => {
      const state: CounterState = { count: 5 };
      const action = CounterActions.incrementByAmount({ amount: 0 });
      const result = counterReducer(state, action);

      expect(result.count).toBe(5);
    });

    it('should handle large amounts', () => {
      const state: CounterState = { count: 0 };
      const action = CounterActions.incrementByAmount({ amount: 1000 });
      const result = counterReducer(state, action);

      expect(result.count).toBe(1000);
    });

    it('should work with negative base count', () => {
      const state: CounterState = { count: -10 };
      const action = CounterActions.incrementByAmount({ amount: 15 });
      const result = counterReducer(state, action);

      expect(result.count).toBe(5);
    });

    it('should create a new state object (immutability)', () => {
      const state: CounterState = { count: 5 };
      const action = CounterActions.incrementByAmount({ amount: 10 });
      const result = counterReducer(state, action);

      expect(result).not.toBe(state);
      expect(state.count).toBe(5); // Original state unchanged
    });
  });

  describe('action sequence', () => {
    it('should handle multiple actions in sequence', () => {
      let state = initialState;

      state = counterReducer(state, CounterActions.increment());
      expect(state.count).toBe(1);

      state = counterReducer(state, CounterActions.increment());
      expect(state.count).toBe(2);

      state = counterReducer(state, CounterActions.incrementByAmount({ amount: 5 }));
      expect(state.count).toBe(7);

      state = counterReducer(state, CounterActions.decrement());
      expect(state.count).toBe(6);

      state = counterReducer(state, CounterActions.reset());
      expect(state.count).toBe(0);
    });
  });
});
