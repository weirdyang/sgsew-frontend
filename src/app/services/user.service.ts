import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser, IUserArray, IUserDisplay, Profile } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.userApi;
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
    return throwError(err);
  }
  getProfile(username: string) {
    return this.http.get<Profile>(`${this.apiUrl}/users/profile/${username}`)
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }

  getSelf() {
    return this.http.get<IUser>(`${this.apiUrl}/users/self`)
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }


  getUsers() {
    return this.http.get<IUserArray>(`${this.apiUrl}/users`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  constructor(private http: HttpClient) { }
}
