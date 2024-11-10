import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "./cookie.service";
import {User} from "./user";
import {BehaviorSubject, catchError, lastValueFrom, map, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = "http://localhost:8080/api";
  private cookieService: CookieService = inject(CookieService);
  loggedInUser: BehaviorSubject<User| undefined> = new BehaviorSubject<User| undefined>(undefined);

  constructor(private httpClient: HttpClient) {}

  public login(email: string, password: string) {
    let authorization: string = `Basic ${btoa(`${email}:${password}`)}`;
    return this.httpClient.post<User>(this.url + "/auth/login", null, { headers: { 'Authorization': `${authorization}` } })
      .pipe(tap(user => {
        this.cookieService.setCookie('TOKEN', authorization, 1);
        this.loggedInUser.next(user);
      }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401)
            return of(null);
          throw error;
        }));
  }

  initializeUser() {
    return lastValueFrom(this.logInSavedUser()).then(() => {}).catch((error) => {});
  }

  logInSavedUser() {
    return this.httpClient
      .post<User>(this.url + "/auth/login", null, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(tap(user => {
        if (this.loggedInUser.getValue() === undefined) {
          this.loggedInUser.next(user);
        }
      }));
  }

  public signup(user: User) {
    user.role = "CUSTOMER";
    return this.httpClient.post<User>(this.url + "/auth/signup", user)
      .pipe(map(() => {
        return { message: "Successfully signed up", success: true };
      }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409)
            return of({ message: error.message, success: false });
          throw error;
        }));
  }

  public signupUser(user: User) {
    return this.httpClient.post<User>(this.url + "/users", user, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(map(() => {
        return { message: "Successfully signed up the user", success: true };
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409)
          return of({ message: error.message, success: false });
        throw error;
      }))
  }

  public signout() {
    return this.httpClient.post(this.url + "/auth/signout", null, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(tap(() => {
        this.cookieService.deleteCookie('TOKEN')
        this.loggedInUser.next(undefined);
      }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        }));
  }

  public getRoles() {
    return ['CUSTOMER', 'STAFF', 'ADMIN'];
  }

  public update(user: User) {
    user.role = 'CUSTOMER';
    return this.httpClient.put<User>(this.url + "/profile/update", user, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  public updateUser(user: User) {
    return this.httpClient.put<User>(this.url + "/users/" + user.email, user, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  public getUser(login: string) {
    return this.httpClient.get<User>(this.url + "/users/" + login, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  public getUsers() {
    return this.httpClient.get<User[]>(this.url + "/users", { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  public deleteUser(email: string) {
    return this.httpClient.delete<void>(this.url + `/users/${email}`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  public getProfileOptionsForUser() {
    let options: {option: string, url: string}[] = [];
    switch (this.loggedInUser.getValue()?.role) {
      // @ts-ignore
      case "ADMIN":
        options.unshift(
          { option: "Manage users", url: "/users" }
        );
        // @ts-ignore
      case "STAFF":
        options.unshift(
          { option: "Manage orders", url: "/orders" }
        );
        // @ts-ignore
      case "CUSTOMER":
        options.unshift(
          { option: "Bookmarks", url: "/profile/bookmarks" },
          { option: "My orders", url: "/profile/orders" },
        );
        break;
    }
    return options;
  }
}
