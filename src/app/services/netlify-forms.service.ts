import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Feedback } from "../home/contact/feedback";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class NetlifyFormsService {
  constructor(private http: HttpClient) { }

  submitFeedback(feedback: Feedback): Observable<string> {
    const entry = new HttpParams({
      fromObject: {
        "form-name": "contact",
        ...feedback,
      },
    });

    return this.submitForm(entry);
  }

  private submitForm(entry: HttpParams): Observable<string> {
    return this.http
      .post("/", entry.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        responseType: "text",
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errMsg = "";

    if (err.error instanceof ErrorEvent) {
      errMsg = `Client-side error: ${err.error.message}`;
    } else {
      errMsg = `Server-side error. Code: ${err.status}. Message: ${err.message}`;
    }

    return throwError(errMsg);
  }
}