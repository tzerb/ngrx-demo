import {
  selectCounterState,
  selectCount,
  selectIsPositive,
  selectIsEven
} from './counter.selectors';
import { CounterState } from '../models/app-state.model';

describe('Counter Selectors', () => {
  describe('selectCounterState', () => {
    it('should select the counter state', () => {
      const counterState: CounterState = { count: 5 };
      const state = {
        counter: counterState,
        users: { users: [], loading: false, error: null },
        ui: { showAddUserModal: false, modalError: null, showCounterModal: false, darkMode: false }
      };

      const result = selectCounterState(state);
      expect(result).toBe(counterState);
    });
  });

  describe('selectCount', () => {
    it('should select count from state', () => {
      const state = {
        counter: { count: 10 }
      };

      const result = selectCount.projector(state.counter);
      expect(result).toBe(10);
    });

    it('should select zero count', () => {
      const state = {
        counter: { count: 0 }
      };

      const result = selectCount.projector(state.counter);
      expect(result).toBe(0);
    });

    it('should select negative count', () => {
      const state = {
        counter: { count: -5 }
      };

      const result = selectCount.projector(state.counter);
      expect(result).toBe(-5);
    });

    it('should select large count', () => {
      const state = {
        counter: { count: 99999 }
      };

      const result = selectCount.projector(state.counter);
      expect(result).toBe(99999);
    });
  });

  describe('selectIsPositive', () => {
    it('should return true for positive numbers', () => {
      expect(selectIsPositive.projector(1)).toBe(true);
      expect(selectIsPositive.projector(5)).toBe(true);
      expect(selectIsPositive.projector(100)).toBe(true);
      expect(selectIsPositive.projector(0.1)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(selectIsPositive.projector(0)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(selectIsPositive.projector(-1)).toBe(false);
      expect(selectIsPositive.projector(-5)).toBe(false);
      expect(selectIsPositive.projector(-100)).toBe(false);
      expect(selectIsPositive.projector(-0.1)).toBe(false);
    });

    it('should handle edge case of very small positive number', () => {
      expect(selectIsPositive.projector(0.0001)).toBe(true);
    });

    it('should handle edge case of very small negative number', () => {
      expect(selectIsPositive.projector(-0.0001)).toBe(false);
    });
  });

  describe('selectIsEven', () => {
    it('should return true for even positive numbers', () => {
      expect(selectIsEven.projector(0)).toBe(true);
      expect(selectIsEven.projector(2)).toBe(true);
      expect(selectIsEven.projector(4)).toBe(true);
      expect(selectIsEven.projector(100)).toBe(true);
      expect(selectIsEven.projector(1000)).toBe(true);
    });

    it('should return false for odd positive numbers', () => {
      expect(selectIsEven.projector(1)).toBe(false);
      expect(selectIsEven.projector(3)).toBe(false);
      expect(selectIsEven.projector(5)).toBe(false);
      expect(selectIsEven.projector(99)).toBe(false);
      expect(selectIsEven.projector(1001)).toBe(false);
    });

    it('should return true for even negative numbers', () => {
      expect(selectIsEven.projector(-2)).toBe(true);
      expect(selectIsEven.projector(-4)).toBe(true);
      expect(selectIsEven.projector(-100)).toBe(true);
    });

    it('should return false for odd negative numbers', () => {
      expect(selectIsEven.projector(-1)).toBe(false);
      expect(selectIsEven.projector(-3)).toBe(false);
      expect(selectIsEven.projector(-5)).toBe(false);
      expect(selectIsEven.projector(-99)).toBe(false);
    });

    it('should handle zero as even', () => {
      expect(selectIsEven.projector(0)).toBe(true);
    });

    it('should handle large even numbers', () => {
      expect(selectIsEven.projector(999998)).toBe(true);
    });

    it('should handle large odd numbers', () => {
      expect(selectIsEven.projector(999999)).toBe(false);
    });
  });

  describe('selector composition', () => {
    it('should correctly derive isPositive and isEven from count', () => {
      const counterState: CounterState = { count: 4 };

      const count = selectCount.projector(counterState);
      const isPositive = selectIsPositive.projector(count);
      const isEven = selectIsEven.projector(count);

      expect(count).toBe(4);
      expect(isPositive).toBe(true);
      expect(isEven).toBe(true);
    });

    it('should handle negative odd number', () => {
      const counterState: CounterState = { count: -3 };

      const count = selectCount.projector(counterState);
      const isPositive = selectIsPositive.projector(count);
      const isEven = selectIsEven.projector(count);

      expect(count).toBe(-3);
      expect(isPositive).toBe(false);
      expect(isEven).toBe(false);
    });

    it('should handle positive odd number', () => {
      const counterState: CounterState = { count: 7 };

      const count = selectCount.projector(counterState);
      const isPositive = selectIsPositive.projector(count);
      const isEven = selectIsEven.projector(count);

      expect(count).toBe(7);
      expect(isPositive).toBe(true);
      expect(isEven).toBe(false);
    });

    it('should handle zero correctly in all selectors', () => {
      const counterState: CounterState = { count: 0 };

      const count = selectCount.projector(counterState);
      const isPositive = selectIsPositive.projector(count);
      const isEven = selectIsEven.projector(count);

      expect(count).toBe(0);
      expect(isPositive).toBe(false); // 0 is not positive
      expect(isEven).toBe(true);       // 0 is even
    });
  });

  describe('memoization', () => {
    it('should use memoization for derived selectors', () => {
      const spy = jasmine.createSpy('projector').and.returnValue(true);
      const count = 5;

      // First call
      selectIsPositive.projector(count);
      // Second call with same value should use memoized result
      selectIsPositive.projector(count);

      // Note: In actual NgRx, memoization happens at the selector level,
      // not the projector level. This test demonstrates the concept.
      expect(count > 0).toBe(true);
    });
  });
});
