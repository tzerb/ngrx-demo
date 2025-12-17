import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserListComponent } from './user-list';
import * as UsersActions from '../../store/actions/users.actions';
import * as UIActions from '../../store/actions/ui.actions';
import { selectAllUsers, selectUsersLoading, selectUsersError } from '../../store/selectors/users.selectors';
import { selectShowAddUserModal } from '../../store/selectors/ui.selectors';
import { User } from '../../store/models/user.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const mockUser1: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
  const mockUser2: User = { id: 2, name: 'Jane Smith', email: 'jane@example.com' };
  const mockUser3: User = { id: 3, name: 'Bob Johnson', email: 'bob@example.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideMockStore({
          initialState: {
            users: {
              users: [],
              loading: false,
              error: null
            },
            ui: {
              showAddUserModal: false,
              modalError: null,
              showCounterModal: false,
              darkMode: false
            }
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  describe('component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize observables from store selectors', () => {
      expect(component.users$).toBeDefined();
      expect(component.loading$).toBeDefined();
      expect(component.error$).toBeDefined();
      expect(component.showModal$).toBeDefined();
    });

    it('should subscribe to users selector', (done) => {
      const users = [mockUser1, mockUser2];
      store.overrideSelector(selectAllUsers, users);
      store.refreshState();

      component.users$.subscribe(result => {
        expect(result).toEqual(users);
        done();
      });
    });

    it('should subscribe to loading selector', (done) => {
      store.overrideSelector(selectUsersLoading, true);
      store.refreshState();

      component.loading$.subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should subscribe to error selector', (done) => {
      const errorMessage = 'Failed to load users';
      store.overrideSelector(selectUsersError, errorMessage);
      store.refreshState();

      component.error$.subscribe(result => {
        expect(result).toBe(errorMessage);
        done();
      });
    });

    it('should subscribe to show modal selector', (done) => {
      store.overrideSelector(selectShowAddUserModal, true);
      store.refreshState();

      component.showModal$.subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch loadUsers action on init', () => {
      fixture.detectChanges(); // triggers ngOnInit

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.loadUsers());
    });

    it('should dispatch loadUsers only once', () => {
      fixture.detectChanges(); // triggers ngOnInit
      fixture.detectChanges(); // second detection

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.loadUsers());
    });

    it('should load users before any user interaction', () => {
      const dispatchOrder: any[] = [];
      dispatchSpy.and.callFake((action: any) => {
        dispatchOrder.push(action.type);
      });

      fixture.detectChanges(); // ngOnInit

      expect(dispatchOrder[0]).toBe('[Users] Load Users');
    });
  });

  describe('openModal', () => {
    it('should dispatch openAddUserModal action', () => {
      fixture.detectChanges();
      dispatchSpy.calls.reset(); // Clear ngOnInit dispatch

      component.openModal();

      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.openAddUserModal());
    });

    it('should dispatch action when called multiple times', () => {
      fixture.detectChanges();
      dispatchSpy.calls.reset();

      component.openModal();
      component.openModal();
      component.openModal();

      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.openAddUserModal());
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      fixture.detectChanges();
      dispatchSpy.calls.reset(); // Clear ngOnInit dispatch
    });

    it('should dispatch deleteUser action with correct id', () => {
      component.deleteUser(1);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 1 }));
    });

    it('should dispatch deleteUser action for different user ids', () => {
      component.deleteUser(5);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 5 }));
    });

    it('should handle deleting first user', () => {
      component.deleteUser(mockUser1.id);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 1 }));
    });

    it('should handle deleting last user', () => {
      component.deleteUser(mockUser3.id);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 3 }));
    });

    it('should handle deleting multiple users in sequence', () => {
      component.deleteUser(1);
      component.deleteUser(2);
      component.deleteUser(3);

      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 1 }));
      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 2 }));
      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 3 }));
    });

    it('should handle large id values', () => {
      component.deleteUser(99999);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 99999 }));
    });

    it('should handle zero id', () => {
      component.deleteUser(0);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 0 }));
    });

    it('should handle negative id', () => {
      component.deleteUser(-1);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: -1 }));
    });
  });

  describe('user list data flow', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display empty user list initially', (done) => {
      store.overrideSelector(selectAllUsers, []);
      store.refreshState();

      component.users$.subscribe(users => {
        expect(users).toEqual([]);
        expect(users.length).toBe(0);
        done();
      });
    });

    it('should display users after loading', (done) => {
      const users = [mockUser1, mockUser2];
      store.overrideSelector(selectAllUsers, users);
      store.refreshState();

      component.users$.subscribe(result => {
        expect(result).toEqual(users);
        expect(result.length).toBe(2);
        done();
      });
    });

    it('should update when users change', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectAllUsers, [mockUser1]);
      store.refreshState();

      component.users$.subscribe(users => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(users).toEqual([mockUser1]);

          // Simulate adding a user
          store.overrideSelector(selectAllUsers, [mockUser1, mockUser2]);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(users).toEqual([mockUser1, mockUser2]);
          done();
        }
      });
    });

    it('should reflect user deletion in observable', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectAllUsers, [mockUser1, mockUser2]);
      store.refreshState();

      component.users$.subscribe(users => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(users.length).toBe(2);

          // Simulate deleting a user
          store.overrideSelector(selectAllUsers, [mockUser2]);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(users.length).toBe(1);
          expect(users[0]).toEqual(mockUser2);
          done();
        }
      });
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show loading state initially', (done) => {
      store.overrideSelector(selectUsersLoading, true);
      store.refreshState();

      component.loading$.subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should hide loading state after load completes', (done) => {
      store.overrideSelector(selectUsersLoading, false);
      store.refreshState();

      component.loading$.subscribe(loading => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should toggle loading state during operations', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectUsersLoading, true);
      store.refreshState();

      component.loading$.subscribe(loading => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(loading).toBe(true);

          store.overrideSelector(selectUsersLoading, false);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(loading).toBe(false);
          done();
        }
      });
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle null error state', (done) => {
      store.overrideSelector(selectUsersError, null);
      store.refreshState();

      component.error$.subscribe(error => {
        expect(error).toBe(null);
        done();
      });
    });

    it('should display error message when loading fails', (done) => {
      const errorMessage = 'Failed to load users';
      store.overrideSelector(selectUsersError, errorMessage);
      store.refreshState();

      component.error$.subscribe(error => {
        expect(error).toBe(errorMessage);
        done();
      });
    });

    it('should clear error after successful retry', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectUsersError, 'Network error');
      store.refreshState();

      component.error$.subscribe(error => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(error).toBe('Network error');

          store.overrideSelector(selectUsersError, null);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(error).toBe(null);
          done();
        }
      });
    });

    it('should handle different error messages', (done) => {
      const errorMessage = 'Server timeout';
      store.overrideSelector(selectUsersError, errorMessage);
      store.refreshState();

      component.error$.subscribe(error => {
        expect(error).toBe(errorMessage);
        done();
      });
    });
  });

  describe('modal visibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show modal when state is true', (done) => {
      store.overrideSelector(selectShowAddUserModal, true);
      store.refreshState();

      component.showModal$.subscribe(show => {
        expect(show).toBe(true);
        done();
      });
    });

    it('should hide modal when state is false', (done) => {
      store.overrideSelector(selectShowAddUserModal, false);
      store.refreshState();

      component.showModal$.subscribe(show => {
        expect(show).toBe(false);
        done();
      });
    });

    it('should toggle modal visibility', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectShowAddUserModal, false);
      store.refreshState();

      component.showModal$.subscribe(show => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(show).toBe(false);

          store.overrideSelector(selectShowAddUserModal, true);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(show).toBe(true);
          done();
        }
      });
    });
  });

  describe('complete workflow scenarios', () => {
    beforeEach(() => {
      fixture.detectChanges();
      dispatchSpy.calls.reset();
    });

    it('should handle complete add user workflow', () => {
      // Open modal
      component.openModal();
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.openAddUserModal());

      // Modal state changes (simulated)
      store.overrideSelector(selectShowAddUserModal, true);
      store.refreshState();

      // After user is added, modal should close (simulated)
      store.overrideSelector(selectShowAddUserModal, false);
      store.overrideSelector(selectAllUsers, [mockUser1]);
      store.refreshState();
    });

    it('should handle delete workflow', () => {
      // Set initial users
      store.overrideSelector(selectAllUsers, [mockUser1, mockUser2]);
      store.refreshState();

      // Delete user
      component.deleteUser(mockUser1.id);
      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 1 }));

      // Simulate user removed from list
      store.overrideSelector(selectAllUsers, [mockUser2]);
      store.refreshState();
    });

    it('should handle load error and retry', () => {
      // Load fails
      store.overrideSelector(selectUsersLoading, false);
      store.overrideSelector(selectUsersError, 'Network error');
      store.refreshState();

      // Retry - dispatch loadUsers again
      component.ngOnInit();
      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.loadUsers());
    });

    it('should handle multiple operations in sequence', () => {
      // Load users
      expect(component.users$).toBeDefined();

      // Open modal
      component.openModal();
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.openAddUserModal());

      dispatchSpy.calls.reset();

      // Delete a user
      component.deleteUser(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: 1 }));

      dispatchSpy.calls.reset();

      // Open modal again
      component.openModal();
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.openAddUserModal());
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
      dispatchSpy.calls.reset();
    });

    it('should handle very large user lists', (done) => {
      const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));

      store.overrideSelector(selectAllUsers, largeUserList);
      store.refreshState();

      component.users$.subscribe(users => {
        expect(users.length).toBe(1000);
        done();
      });
    });

    it('should handle rapid delete operations', () => {
      component.deleteUser(1);
      component.deleteUser(2);
      component.deleteUser(3);
      component.deleteUser(4);
      component.deleteUser(5);

      expect(dispatchSpy).toHaveBeenCalledTimes(5);
    });

    it('should handle rapid modal open/close', () => {
      component.openModal();
      component.openModal();
      component.openModal();

      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.openAddUserModal());
    });
  });
});
