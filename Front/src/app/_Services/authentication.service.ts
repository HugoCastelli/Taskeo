import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '@environments/environment';
import {User} from '@models/user';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): any {
    return this.http.post<any>(`${environment.apiUrl}/authentification/login`, {email, password})
      .pipe(map(res => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
        return res;
      }));
  }

  register(form: any): any {
    delete form.confirmPassword;
    return this.http.post<any>(`${environment.apiUrl}/authentification/register`, form);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined as any);
    this.router.navigate(['/']);
  }
}
