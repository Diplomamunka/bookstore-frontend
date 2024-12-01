import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "./user";
import {BehaviorSubject, catchError, lastValueFrom, map, of, tap} from "rxjs";
import {BaseService} from "./base.service";
import {Book} from "./book";
import {BookService} from "./book.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  loggedInUser: BehaviorSubject<User| undefined> = new BehaviorSubject<User| undefined>(undefined);

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
    if (this.cookieService.getCookie('TOKEN'))
      return lastValueFrom(this.logInSavedUser()).then(() => {}).catch((error: HttpErrorResponse) => {
        this.cookieService.deleteCookie('TOKEN');
        return Promise.resolve();
      });
    else {
      console.log("No valid token found!");
      return Promise.resolve();
    }
  }

  logInSavedUser() {
    return this.httpClient
      .post<User>(this.url + "/auth/login", null, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(tap(user => {
        if (this.loggedInUser.getValue() === undefined) {
          this.loggedInUser.next(user);
        } catchError((error: HttpErrorResponse) => {
          if (error.status === 401)
            console.log("User token has expired");
          else
            console.log(error.error);
          throw error;
        })
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
            return of({ message: error.error, success: false });
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
          return of({ message: error.error, success: false });
        throw error;
      }))
  }

  public signOut() {
    return this.httpClient.post(this.url + "/auth/signout", null, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(tap(() => {
        this.cookieService.deleteCookie('TOKEN')
        this.loggedInUser.next(undefined);
      }));
  }

  public getBookmarks() {
    return this.httpClient.get<Book[]>(this.url + "/profile/bookmarks", { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(map(books => books.map(book => BookService.modifyBook(book))));
  }

  public getRoles() {
    return ['CUSTOMER', 'STAFF', 'ADMIN'];
  }

  public update(user: User) {
    user.role = 'CUSTOMER';
    return this.httpClient.put<User>(this.url + "/profile/update", user, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          alert(error.error);
        throw error;
      }));
  }

  public updateUser(user: User) {
    return this.httpClient.put<User>(this.url + "/users/" + user.email, user, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          alert(error.error);
        throw error;
      }));
  }

  public getUser(login: string) {
    return this.httpClient.get<User>(this.url + "/users/" + login, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          alert(error.error);
        throw error;
      }));
  }

  public getUsers() {
    return this.httpClient.get<User[]>(this.url + "/users", { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  public deleteUser(email: string) {
    return this.httpClient.delete<void>(this.url + `/users/${email}`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 403)
          alert(error.error);
        throw error;
      }));
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
      // @ts-ignore
      case "CUSTOMER":
        options.unshift(
          { option: "Bookmarks", url: "/profile/bookmarks" },
        );
        break;
      default:
        return [];
    }
    return options;
  }
}
