import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/models/app-state.model';
import { User } from '../../store/models/user.model';
import * as UsersActions from '../../store/actions/users.actions';
import * as UIActions from '../../store/actions/ui.actions';
import { selectAllUsers, selectUsersLoading, selectUsersError } from '../../store/selectors/users.selectors';
import { selectShowAddUserModal } from '../../store/selectors/ui.selectors';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, AddUserModalComponent],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showModal$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
    this.error$ = this.store.select(selectUsersError);
    this.showModal$ = this.store.select(selectShowAddUserModal);
  }

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
  }

  openModal() {
    this.store.dispatch(UIActions.openAddUserModal());
  }

  deleteUser(id: number) {
    this.store.dispatch(UsersActions.deleteUser({ id }));
  }
}
