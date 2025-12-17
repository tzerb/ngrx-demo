import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { AddUserModalComponent } from './add-user-modal';
import * as UsersActions from '../../store/actions/users.actions';
import * as UIActions from '../../store/actions/ui.actions';
import { selectModalError } from '../../store/selectors/ui.selectors';

describe('AddUserModalComponent', () => {
  let component: AddUserModalComponent;
  let fixture: ComponentFixture<AddUserModalComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserModalComponent, FormsModule],
      providers: [
        provideMockStore({
          initialState: {
            ui: {
              showAddUserModal: true,
              modalError: null,
              showCounterModal: false,
              darkMode: false
            }
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  describe('component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty name and email', () => {
      expect(component.name).toBe('');
      expect(component.email).toBe('');
    });

    it('should subscribe to error message selector', () => {
      store.overrideSelector(selectModalError, 'Test error');
      component.errorMessage$.subscribe(error => {
        expect(error).toBe('Test error');
      });
    });

    it('should have null error message initially', () => {
      store.overrideSelector(selectModalError, null);
      component.errorMessage$.subscribe(error => {
        expect(error).toBe(null);
      });
    });
  });

  describe('onSubmit', () => {
    describe('with valid data', () => {
      it('should dispatch addUserRequest with trimmed values', () => {
        component.name = 'John Doe';
        component.email = 'john@example.com';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: 'John Doe',
              email: 'john@example.com'
            }
          })
        );
      });

      it('should trim whitespace from name and email', () => {
        component.name = '  John Doe  ';
        component.email = '  john@example.com  ';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: 'John Doe',
              email: 'john@example.com'
            }
          })
        );
      });

      it('should handle name with only leading whitespace', () => {
        component.name = '  John Doe';
        component.email = 'john@example.com';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: 'John Doe',
              email: 'john@example.com'
            }
          })
        );
      });

      it('should handle email with only trailing whitespace', () => {
        component.name = 'John Doe';
        component.email = 'john@example.com  ';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: 'John Doe',
              email: 'john@example.com'
            }
          })
        );
      });
    });

    describe('with invalid data', () => {
      it('should not dispatch when name is empty', () => {
        component.name = '';
        component.email = 'john@example.com';

        component.onSubmit();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch when email is empty', () => {
        component.name = 'John Doe';
        component.email = '';

        component.onSubmit();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch when both are empty', () => {
        component.name = '';
        component.email = '';

        component.onSubmit();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch when name is only whitespace', () => {
        component.name = '   ';
        component.email = 'john@example.com';

        component.onSubmit();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch when email is only whitespace', () => {
        component.name = 'John Doe';
        component.email = '   ';

        component.onSubmit();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch when both are only whitespace', () => {
        component.name = '   ';
        component.email = '   ';

        component.onSubmit();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch with tabs and newlines', () => {
        component.name = '\t\n';
        component.email = '\t\n';

        component.onSubmit();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe('edge cases', () => {
      it('should handle very long names', () => {
        const longName = 'A'.repeat(100);
        component.name = longName;
        component.email = 'test@example.com';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: longName,
              email: 'test@example.com'
            }
          })
        );
      });

      it('should handle special characters in name', () => {
        component.name = "O'Brien-Smith";
        component.email = 'test@example.com';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: "O'Brien-Smith",
              email: 'test@example.com'
            }
          })
        );
      });

      it('should handle plus sign in email', () => {
        component.name = 'John Doe';
        component.email = 'john+tag@example.com';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: 'John Doe',
              email: 'john+tag@example.com'
            }
          })
        );
      });

      it('should handle unicode characters in name', () => {
        component.name = 'José García';
        component.email = 'jose@example.com';

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          UsersActions.addUserRequest({
            user: {
              name: 'José García',
              email: 'jose@example.com'
            }
          })
        );
      });
    });
  });

  describe('onClose', () => {
    it('should dispatch closeAddUserModal action', () => {
      component.onClose();

      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.closeAddUserModal());
    });

    it('should reset form fields', () => {
      component.name = 'John Doe';
      component.email = 'john@example.com';

      component.onClose();

      expect(component.name).toBe('');
      expect(component.email).toBe('');
    });

    it('should reset form even with whitespace values', () => {
      component.name = '  John Doe  ';
      component.email = '  john@example.com  ';

      component.onClose();

      expect(component.name).toBe('');
      expect(component.email).toBe('');
    });

    it('should dispatch close action before resetting form', () => {
      component.name = 'John Doe';
      component.email = 'john@example.com';

      component.onClose();

      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.closeAddUserModal());
      expect(component.name).toBe('');
      expect(component.email).toBe('');
    });
  });

  describe('onEmailChange', () => {
    it('should dispatch clearModalError action', () => {
      component.onEmailChange();

      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.clearModalError());
    });

    it('should clear error even when email is empty', () => {
      component.email = '';
      component.onEmailChange();

      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.clearModalError());
    });

    it('should clear error when email has content', () => {
      component.email = 'test@example.com';
      component.onEmailChange();

      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.clearModalError());
    });

    it('should be called multiple times for multiple changes', () => {
      component.onEmailChange();
      component.onEmailChange();
      component.onEmailChange();

      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.clearModalError());
    });
  });

  describe('error message handling', () => {
    it('should display error message from store', (done) => {
      const errorMessage = 'Email already exists';
      store.overrideSelector(selectModalError, errorMessage);
      store.refreshState();

      component.errorMessage$.subscribe(error => {
        expect(error).toBe(errorMessage);
        done();
      });
    });

    it('should update when error changes', (done) => {
      store.overrideSelector(selectModalError, 'Error 1');
      store.refreshState();

      let count = 0;
      component.errorMessage$.subscribe(error => {
        count++;
        if (count === 1) {
          expect(error).toBe('Error 1');

          // Change the error
          store.overrideSelector(selectModalError, 'Error 2');
          store.refreshState();
        } else if (count === 2) {
          expect(error).toBe('Error 2');
          done();
        }
      });
    });

    it('should handle null error', (done) => {
      store.overrideSelector(selectModalError, null);
      store.refreshState();

      component.errorMessage$.subscribe(error => {
        expect(error).toBe(null);
        done();
      });
    });
  });

  describe('form workflow scenarios', () => {
    it('should handle complete form submission workflow', () => {
      // Fill form
      component.name = 'John Doe';
      component.email = 'john@example.com';

      // Submit
      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UsersActions.addUserRequest({
          user: { name: 'John Doe', email: 'john@example.com' }
        })
      );

      // Close modal
      dispatchSpy.calls.reset();
      component.onClose();
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.closeAddUserModal());
      expect(component.name).toBe('');
      expect(component.email).toBe('');
    });

    it('should handle error correction workflow', () => {
      // Set initial error
      store.overrideSelector(selectModalError, 'Email exists');

      // User starts typing to correct
      component.email = 'newemail@example.com';
      component.onEmailChange();
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.clearModalError());

      // Submit with corrected email
      dispatchSpy.calls.reset();
      component.name = 'John Doe';
      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UsersActions.addUserRequest({
          user: { name: 'John Doe', email: 'newemail@example.com' }
        })
      );
    });

    it('should handle cancel after partial form entry', () => {
      component.name = 'Partial';
      component.email = '';

      component.onClose();

      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.closeAddUserModal());
      expect(component.name).toBe('');
      expect(component.email).toBe('');
    });

    it('should handle multiple email changes before submit', () => {
      component.name = 'John Doe';
      component.email = 'test1@example.com';
      component.onEmailChange();

      component.email = 'test2@example.com';
      component.onEmailChange();

      component.email = 'test3@example.com';
      component.onEmailChange();

      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(dispatchSpy).toHaveBeenCalledWith(UIActions.clearModalError());

      dispatchSpy.calls.reset();
      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UsersActions.addUserRequest({
          user: { name: 'John Doe', email: 'test3@example.com' }
        })
      );
    });
  });

  describe('validation edge cases', () => {
    it('should reject submission with single space character', () => {
      component.name = ' ';
      component.email = ' ';

      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should accept name with internal whitespace', () => {
      component.name = 'John   Doe';
      component.email = 'john@example.com';

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        UsersActions.addUserRequest({
          user: { name: 'John   Doe', email: 'john@example.com' }
        })
      );
    });

    it('should handle name with leading/trailing spaces mixed with internal spaces', () => {
      component.name = '  John   Doe  ';
      component.email = 'john@example.com';

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        UsersActions.addUserRequest({
          user: { name: 'John   Doe', email: 'john@example.com' }
        })
      );
    });
  });
});
