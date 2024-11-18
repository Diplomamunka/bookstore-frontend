import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "./cookie.service";
import {Book} from "./book";
import {Author} from "./author";

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseService {

  constructor(http: HttpClient, cookieService: CookieService) {
    super(http, cookieService);
    this.url += "/authors";
  }

  getAll() {
    return this.httpClient.get<Author[]>(this.url);
  }

  new(author: Author) {
    return this.httpClient.post<Author>(this.url, author, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  delete(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  update(author: Author) {
    return this.httpClient.put<Author>(`${this.url}/${author.id}`, author, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  deleteAllBooks(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}/books`, { headers: { Authorization: `Basic ${this.cookieService.getCookie('TOKEN')}` } });
  }

  getAllBooks(id: bigint) {
    return this.httpClient.get<Book[]>(this.url + `/${id}/books`);
  }
}
