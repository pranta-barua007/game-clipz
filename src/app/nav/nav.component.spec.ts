import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { NavComponent } from './nav.component';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  const mockedAuthService = jasmine.createSpyObj(
    'AuthService',
    ['createUser', 'logout'],
    {
      isAuthenticated$: of(true), //an observable, always emits true
    }
  );
  const mockedStore = jasmine.createSpyObj('Store', ['dispatch']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavComponent],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: Store, useValue: mockedStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out', () => {
    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(3) a'));

    expect(logoutLink).withContext('Not logged in').toBeTruthy();

    // simulating a DOM event (triggering a click event)
    logoutLink.triggerEventHandler('click');

    const service = TestBed.inject(AuthService);

    expect(service.logout)
      .withContext('Could not click log out link')
      .toHaveBeenCalledTimes(1);
  });
});
