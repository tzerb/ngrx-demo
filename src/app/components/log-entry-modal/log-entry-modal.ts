import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { AppState } from '../../store/models/app-state.model';
import * as LogActions from '../../store/actions/log.actions';
import * as UIActions from '../../store/actions/ui.actions';

@Component({
  selector: 'app-log-entry-modal',
  imports: [FormsModule],
  templateUrl: './log-entry-modal.html',
  styleUrl: './log-entry-modal.scss'
})
export class LogEntryModal {
  message: string = '';

  constructor(private store: Store<AppState>) {}

  onSubmit() {
    if (this.message.trim()) {
      this.store.dispatch(LogActions.addLogEntry({ message: this.message.trim() }));
      this.store.dispatch(UIActions.closeLogModal());
      this.resetForm();
    }
  }

  onClose() {
    this.store.dispatch(UIActions.closeLogModal());
    this.resetForm();
  }

  private resetForm() {
    this.message = '';
  }
}
