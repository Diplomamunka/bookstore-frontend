import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "./cookie.service";
import {Book} from "./book";
import {Category} from "./category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  constructor(http: HttpClient, cookieService: CookieService) {
    super(http, cookieService);
    this.url += "/categories";
  }

  deleteAllBooks(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}/books`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  getAllBooks(id: bigint) {
    return this.httpClient.get<Book[]>(this.url + `/${id}/books`);
  }

  getAll() {
    return this.httpClient.get<Category[]>(this.url);
  }

  new(category: Category) {
    return this.httpClient.post<Category>(this.url, category, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  update(category: Category) {
    return this.httpClient.put<Category>(`${this.url}/${category.id}`, category, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  delete(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }
}
