import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IProductResults } from '../types/product';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }
  apiUrl = environment.productApi;
  baseUrl = `${this.apiUrl}/search`

  search(params: HttpParams) {
    return this.http
      .get<IProductResults>(`${this.baseUrl}/products`, { params })
      .pipe(
        catchError(err => this.handleError(err)),
        shareReplay(1)
      )
  }

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
    console.error(err);
    return throwError(err);
  }
}
