import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, filter, first, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IApiResponse, ILogin, IUser, Profile, RegisterUser } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCsrfToken() {
    return this.http.get<any>(`${this.apiUrl}/auth/csrftoken`)
      .pipe(
        catchError(error => this.handleError(error)),
        map(value => value.token as string),
        first(),
      );
  }
  private _csrfToken = '';

  get csrfToken() {
    return this._csrfToken;
  }
  set csrfToken(value) {
    this._csrfToken = value;
  }

  logOut() {
    return this.http.get(`${this.apiUrl}/auth/logout`)
      .pipe(
        catchError(error => this.handleError(error)),
        tap(_ => this.deleteUser())
      )
  }
  apiUrl = environment.userApi;

  USER_KEY = 'user_info'
  private _currentUserSubject = new BehaviorSubject<IUser | null>(null);

  public currentUser$ = this._currentUserSubject
    .asObservable()
    .pipe(shareReplay(1))

  get isAuthenticated() {
    return this.getUser() !== null;
  }

  setUser = (user: IUser) => {
    console.log('setting...')
    window.localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._currentUserSubject.next(user as IUser);
  }
  deleteUser = () => {
    window.localStorage.removeItem(this.USER_KEY);
    this._currentUserSubject.next(null);
  }
  getUser = (): IUser | null => {
    const user = window.localStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user).user;
    }
    return null;
  };

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(err);
  }

  loginUser(user: ILogin) {

    return this.http.post<IUser>(`${this.apiUrl}/auth/login`, user)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  registerUser(user: RegisterUser) {
    return this.http.post<IApiResponse>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }

  checkKey(key: string) {
    return this.http.post<IApiResponse>(`${this.apiUrl}/auth/key`, { key })
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }

  constructor(private http: HttpClient) { }
}
