import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../store/models/app-state.model';
//import { selectLogEntries } from '../../store/selectors/log.selectors';
import * as UIActions from '../../store/actions/ui.actions';
import * as LogActions from '../../store/actions/log.actions';

@Component({
  selector: 'app-log-display',
  imports: [CommonModule],
  templateUrl: './log-display.html',
  styleUrl: './log-display.scss'
})
export class LogDisplay {
  //logEntries$: Observable<LogEntry[]>;

  constructor(private store: Store<AppState>) {
    //this.logEntries$ = this.store.select(selectLogEntries);
  }

  openLogModal() {
    //this.store.dispatch(UIActions.openLogModal());
  }

  clearLog() {
    this.store.dispatch(LogActions.clearLog());
  }
}
