import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) {
    console.log('in constructor')
  }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401) {
      //navigate /delete cookies or whatever
      this.authService.deleteUser();
      this.router.navigateByUrl(`/`);
      this.snackBar.open('Please login', 'OK');
      return EMPTY; // or EMPTY may be appropriate here
    }
    if (err.status === 403) {
      const message = err.error?.message ?? 'You do not have the necessary perimissions.'
      this.snackBar.open(message, 'OK');
      return EMPTY; // or EMPTY may be appropriate here
    }
    return throwError(err);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    req = req.clone({
      withCredentials: true,
      setHeaders: { "x-csrf-token": this.authService.csrfToken }
    });

    return next.handle(req)
      .pipe(
        catchError(err => this.handleAuthError(err))
      );
  }
}
