import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/models/app-state.model';
import * as UsersActions from '../../store/actions/users.actions';
import * as UIActions from '../../store/actions/ui.actions';
import { selectModalError } from '../../store/selectors/ui.selectors';

@Component({
  selector: 'app-add-user-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-modal.html',
  styleUrl: './add-user-modal.scss'
})
export class AddUserModalComponent {
  name = '';
  email = '';
  errorMessage$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    this.errorMessage$ = this.store.select(selectModalError);
  }

  onSubmit() {
    if (this.name.trim() && this.email.trim()) {
      this.store.dispatch(UsersActions.addUserRequest({
        user: {
          name: this.name.trim(),
          email: this.email.trim()
        }
      }));
    }
  }

  onClose() {
    this.store.dispatch(UIActions.closeAddUserModal());
    this.resetForm();
  }

  onEmailChange() {
    // Clear error when user types
    this.store.dispatch(UIActions.clearModalError());
  }

  private resetForm() {
    this.name = '';
    this.email = '';
  }
}
