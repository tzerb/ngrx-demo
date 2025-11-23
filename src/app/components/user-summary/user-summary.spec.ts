import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserSummaryComponent } from './user-summary';
import { selectAllUsers, selectUsersCount } from '../../store/selectors/users.selectors';
import { User } from '../../store/models/user.model';

describe('UserSummaryComponent', () => {
  let component: UserSummaryComponent;
  let fixture: ComponentFixture<UserSummaryComponent>;
  let store: MockStore;

  const mockUser1: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
  const mockUser2: User = { id: 2, name: 'Jane Smith', email: 'jane@example.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSummaryComponent],
      providers: [
        provideMockStore({
          initialState: {
            users: {
              users: [],
              loading: false,
              error: null
            }
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSummaryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  describe('component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize users$ observable', () => {
      expect(component.users$).toBeDefined();
    });

    it('should initialize userCount$ observable', () => {
      expect(component.userCount$).toBeDefined();
    });

    it('should subscribe to selectAllUsers selector', (done) => {
      const users = [mockUser1, mockUser2];
      store.overrideSelector(selectAllUsers, users);
      store.refreshState();

      component.users$.subscribe(result => {
        expect(result).toEqual(users);
        done();
      });
    });

    it('should subscribe to selectUsersCount selector', (done) => {
      store.overrideSelector(selectUsersCount, 5);
      store.refreshState();

      component.userCount$.subscribe(result => {
        expect(result).toBe(5);
        done();
      });
    });
  });

  describe('getInitials', () => {
    describe('standard names', () => {
      it('should return initials for two-word name', () => {
        expect(component.getInitials('John Doe')).toBe('JD');
      });

      it('should return initials for three-word name', () => {
        expect(component.getInitials('John Paul Jones')).toBe('JP');
      });

      it('should return initials for four-word name (only first two)', () => {
        expect(component.getInitials('John Paul George Ringo')).toBe('JP');
      });

      it('should return initials for single name', () => {
        expect(component.getInitials('Madonna')).toBe('M');
      });

      it('should convert to uppercase', () => {
        expect(component.getInitials('john doe')).toBe('JD');
      });

      it('should handle mixed case names', () => {
        expect(component.getInitials('jOhN dOe')).toBe('JD');
      });
    });

    describe('edge cases - whitespace', () => {
      it('should handle extra spaces between words', () => {
        expect(component.getInitials('John  Doe')).toBe('JD');
      });

      it('should handle multiple spaces between words', () => {
        expect(component.getInitials('John    Doe')).toBe('JD');
      });

      it('should handle leading space', () => {
        expect(component.getInitials(' John Doe')).toBe('JD');
      });

      it('should handle trailing space', () => {
        expect(component.getInitials('John Doe ')).toBe('JD');
      });

      it('should handle leading and trailing spaces', () => {
        expect(component.getInitials('  John Doe  ')).toBe('JD');
      });

      it('should handle tabs between words', () => {
        expect(component.getInitials('John\tDoe')).toBe('JD');
      });
    });

    describe('edge cases - empty and special', () => {
      it('should handle empty string', () => {
        expect(component.getInitials('')).toBe('');
      });

      it('should handle single space', () => {
        expect(component.getInitials(' ')).toBe('');
      });

      it('should handle multiple spaces only', () => {
        expect(component.getInitials('   ')).toBe('');
      });

      it('should handle single letter name', () => {
        expect(component.getInitials('J')).toBe('J');
      });

      it('should handle two single-letter names', () => {
        expect(component.getInitials('J D')).toBe('JD');
      });
    });

    describe('edge cases - special characters', () => {
      it('should handle hyphenated first name', () => {
        expect(component.getInitials('Mary-Jane Watson')).toBe('MW');
      });

      it('should handle hyphenated last name', () => {
        expect(component.getInitials('John Smith-Jones')).toBe('JS');
      });

      it('should handle apostrophe in name', () => {
        expect(component.getInitials("O'Brien Smith")).toBe('OS');
      });

      it('should handle period in name (initials)', () => {
        expect(component.getInitials('J. K. Rowling')).toBe('JK');
      });

      it('should handle name with prefix', () => {
        expect(component.getInitials('Dr. John Doe')).toBe('DJ');
      });

      it('should handle name with suffix', () => {
        expect(component.getInitials('John Doe Jr.')).toBe('JD');
      });
    });

    describe('edge cases - unicode and international', () => {
      it('should handle accented characters', () => {
        expect(component.getInitials('José García')).toBe('JG');
      });

      it('should handle German umlaut', () => {
        expect(component.getInitials('Müller Schmidt')).toBe('MS');
      });

      it('should handle Scandinavian characters', () => {
        expect(component.getInitials('Øyvind Åse')).toBe('ØÅ');
      });

      it('should handle Cyrillic characters', () => {
        expect(component.getInitials('Иван Петров')).toBe('ИП');
      });

      it('should handle Chinese characters', () => {
        expect(component.getInitials('李 明')).toBe('李明');
      });

      it('should handle Arabic characters', () => {
        expect(component.getInitials('محمد علي')).toBe('مع');
      });
    });

    describe('edge cases - length handling', () => {
      it('should limit to 2 characters for long names', () => {
        expect(component.getInitials('John Paul George Ringo Stuart Pete')).toBe('JP');
      });

      it('should return 1 character for single word', () => {
        expect(component.getInitials('Prince')).toBe('P');
      });

      it('should return empty for name with no valid characters after split', () => {
        const result = component.getInitials('   ');
        expect(result).toBe('');
      });
    });

    describe('real-world name examples', () => {
      it('should handle John Smith', () => {
        expect(component.getInitials('John Smith')).toBe('JS');
      });

      it('should handle Mary Jane Watson', () => {
        expect(component.getInitials('Mary Jane Watson')).toBe('MJ');
      });

      it('should handle Martin Luther King Jr.', () => {
        expect(component.getInitials('Martin Luther King Jr.')).toBe('ML');
      });

      it('should handle Leonardo DiCaprio', () => {
        expect(component.getInitials('Leonardo DiCaprio')).toBe('LD');
      });

      it('should handle Elon Musk', () => {
        expect(component.getInitials('Elon Musk')).toBe('EM');
      });

      it('should handle Barack Obama', () => {
        expect(component.getInitials('Barack Obama')).toBe('BO');
      });
    });

    describe('extreme edge cases', () => {
      it('should handle very long single word', () => {
        const longName = 'A'.repeat(100);
        expect(component.getInitials(longName)).toBe('A');
      });

      it('should handle name with numbers', () => {
        expect(component.getInitials('User 123')).toBe('U1');
      });

      it('should handle name with emoji', () => {
        expect(component.getInitials('John 😀 Doe')).toBe('J😀');
      });

      it('should handle all uppercase name', () => {
        expect(component.getInitials('JOHN DOE')).toBe('JD');
      });

      it('should handle all lowercase name', () => {
        expect(component.getInitials('john doe')).toBe('JD');
      });

      it('should handle name starting with lowercase', () => {
        expect(component.getInitials('iPhone User')).toBe('IU');
      });
    });
  });

  describe('user data flow', () => {
    it('should display empty user array initially', (done) => {
      store.overrideSelector(selectAllUsers, []);
      store.refreshState();

      component.users$.subscribe(users => {
        expect(users).toEqual([]);
        done();
      });
    });

    it('should display user count of 0 initially', (done) => {
      store.overrideSelector(selectUsersCount, 0);
      store.refreshState();

      component.userCount$.subscribe(count => {
        expect(count).toBe(0);
        done();
      });
    });

    it('should update users when data changes', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectAllUsers, [mockUser1]);
      store.refreshState();

      component.users$.subscribe(users => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(users).toEqual([mockUser1]);

          store.overrideSelector(selectAllUsers, [mockUser1, mockUser2]);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(users).toEqual([mockUser1, mockUser2]);
          done();
        }
      });
    });

    it('should update user count when users change', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectUsersCount, 1);
      store.refreshState();

      component.userCount$.subscribe(count => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(count).toBe(1);

          store.overrideSelector(selectUsersCount, 5);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(count).toBe(5);
          done();
        }
      });
    });

    it('should handle large user lists', (done) => {
      const largeUserList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));

      store.overrideSelector(selectAllUsers, largeUserList);
      store.overrideSelector(selectUsersCount, 100);
      store.refreshState();

      component.users$.subscribe(users => {
        expect(users.length).toBe(100);
        done();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should correctly generate initials for all mock users', () => {
      expect(component.getInitials(mockUser1.name)).toBe('JD');
      expect(component.getInitials(mockUser2.name)).toBe('JS');
    });

    it('should work with users from store', (done) => {
      const users = [mockUser1, mockUser2];
      store.overrideSelector(selectAllUsers, users);
      store.refreshState();

      component.users$.subscribe(result => {
        const initials = result.map(user => component.getInitials(user.name));
        expect(initials).toEqual(['JD', 'JS']);
        done();
      });
    });

    it('should handle dynamic user additions', (done) => {
      let emissionCount = 0;

      store.overrideSelector(selectAllUsers, [mockUser1]);
      store.overrideSelector(selectUsersCount, 1);
      store.refreshState();

      component.users$.subscribe(users => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(users.length).toBe(1);
          expect(component.getInitials(users[0].name)).toBe('JD');

          const newUser: User = { id: 3, name: 'Alice Wonder', email: 'alice@example.com' };
          store.overrideSelector(selectAllUsers, [mockUser1, newUser]);
          store.overrideSelector(selectUsersCount, 2);
          store.refreshState();
        } else if (emissionCount === 2) {
          expect(users.length).toBe(2);
          expect(component.getInitials(users[1].name)).toBe('AW');
          done();
        }
      });
    });
  });
});
