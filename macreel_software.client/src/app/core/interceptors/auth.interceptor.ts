import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, take, switchMap, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<boolean>(false);
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const baseUrl = environment.apiUrl;

  // Always send cookies
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        // If refresh already running → wait
        if (isRefreshing) {
          return refreshSubject.pipe(
            filter(done => done),
            take(1),
            switchMap(() => next(authReq))
          );
        }

        // Start refresh flow
        isRefreshing = true;
        refreshSubject.next(false);

        return http.post(`${baseUrl}Auth/refresh`, {}, { withCredentials: true }).pipe(
          switchMap(() => {
            isRefreshing = false;
            refreshSubject.next(true);
            return next(authReq); // retry original request
          }),
          catchError(err => {
            isRefreshing = false;
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
