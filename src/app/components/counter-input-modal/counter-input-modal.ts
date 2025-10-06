import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/models/app-state.model';
import * as CounterActions from '../../store/actions/counter.actions';
import * as UIActions from '../../store/actions/ui.actions';

@Component({
  selector: 'app-counter-input-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './counter-input-modal.html',
  styleUrl: './counter-input-modal.scss'
})
export class CounterInputModalComponent {
  amount: number | null = null;

  constructor(private store: Store<AppState>) {}

  onSubmit() {
    if (this.amount !== null && this.amount !== 0) {
      this.store.dispatch(CounterActions.incrementByAmount({ amount: this.amount }));
      this.store.dispatch(UIActions.closeCounterModal());
      this.resetForm();
    }
  }

  onClose() {
    this.store.dispatch(UIActions.closeCounterModal());
    this.resetForm();
  }

  private resetForm() {
    this.amount = null;
  }
}
