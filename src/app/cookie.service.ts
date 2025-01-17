import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  public getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < ca.length; i++) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  public deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }

  public setCookie(name: string, value: string, expireDays: number, path: string = '') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }
}
