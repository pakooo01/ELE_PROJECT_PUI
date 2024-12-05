import { Injectable } from '@angular/core';
import { User } from '../../interface/interface.module';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user: User | null = null;
  private loginUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/login';

  private httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
  };

  constructor(private http: HttpClient) {}

  isLogged() {
    return this.user != null;
  }

  getLoggedInUserId(): number | null {
    return this.user ? this.user.id : null; 
  }
  
  login(name: string, pwd: string): Observable<User> {
    const usereq = new HttpParams()
      .set('username', name)
      .set('passwd', pwd);
  
    console.log('Richiesta di login inviata con:', usereq.toString());
  
    return this.http.post<User>(this.loginUrl, usereq, this.httpOptions).pipe(
      tap(user => {
        console.log('Risposta API:', user); 
        this.user = user; 
      }),
      catchError(error => {
        // Gestisci l'errore qui
        let errorMessage = 'An unknown error occurred.';
        if (error.status === 401) {
          errorMessage = 'Invalid credentials. Please try again.';
        } else if (error.status === 0) {
          errorMessage = 'No connection to the server.';
        }
        // Logga l'errore
        console.error('Login error', error);
        // Lancia l'errore come un observable
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  

  getUserData(): User | null {
    return this.user;
  }

  logout() {
    this.user = null;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.user = null;
      console.error(error); 
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
