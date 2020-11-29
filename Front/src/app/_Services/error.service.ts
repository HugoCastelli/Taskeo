import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '@services/authentication.service';
import {NotificationService} from '@services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService, private notification: NotificationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.authenticationService.logout();
        location.reload(true);
      }
      if (err.status !== 200) {
        if (err.status === 500) {
          this.notification.showError('Une erreur du serveur est survenue.');
        } else {
          this.notification.showError('Une erreur non spécifié est survenue.');
        }
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
