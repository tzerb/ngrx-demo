import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/models/app-state.model';
import * as CounterActions from '../../store/actions/counter.actions';
import * as UIActions from '../../store/actions/ui.actions';
import { selectCount, selectIsEven, selectIsPositive } from '../../store/selectors/counter.selectors';
import { selectShowCounterModal } from '../../store/selectors/ui.selectors';
import { CounterInputModalComponent } from '../counter-input-modal/counter-input-modal';

@Component({
  selector: 'app-counter',
  imports: [CommonModule, CounterInputModalComponent],
  templateUrl: './counter.html',
  styleUrl: './counter.scss'
})
export class CounterComponent {
  count$: Observable<number>;
  isEven$: Observable<boolean>;
  isPositive$: Observable<boolean>;
  showModal$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.count$ = this.store.select(selectCount);
    this.isEven$ = this.store.select(selectIsEven);
    this.isPositive$ = this.store.select(selectIsPositive);
    this.showModal$ = this.store.select(selectShowCounterModal);
  }

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }

  reset() {
    this.store.dispatch(CounterActions.reset());
  }

  openCustomIncrement() {
    this.store.dispatch(UIActions.openCounterModal());
  }
}
