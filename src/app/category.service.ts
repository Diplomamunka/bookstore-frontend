import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "./cookie.service";
import {Book} from "./book";
import {Category} from "./category";
import {catchError, map} from "rxjs";
import {BookService} from "./book.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  constructor(http: HttpClient, cookieService: CookieService) {
    super(http, cookieService);
    this.url += "/categories";
  }

  deleteAllBooks(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}/books`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 500)
          alert("Could not delete, because of one of the books caused an internal server error!");
        throw error;
      }));
  }

  getAllBooks(id: bigint) {
    return this.httpClient.get<Book[]>(this.url + `/${id}/books`)
      .pipe(map(books => books.map(book => BookService.modifyBook(book))));
  }

  getAll() {
    return this.httpClient.get<Category[]>(this.url)
      .pipe(map(categories => categories.map(category => CategoryService.modifyCategory(category))));
  }

  new(category: Category) {
    return this.httpClient.post<Category>(this.url, category, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(map(category => CategoryService.modifyCategory(category)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409)
            alert(error.error);
          throw error;
        }));
  }

  update(id: bigint, category: Category) {
    return this.httpClient.put<Category>(`${this.url}/${id}`, category, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(map(category => CategoryService.modifyCategory(category)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409)
            alert(error.error);
          else if (error.status === 404)
            alert(error.error);
          throw error;
        }));
  }

  delete(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 409)
          alert(error.error);
        throw error;
      }));
  }

  public static modifyCategory(category: Category) {
    category.id = category.id as bigint;
    return category;
  }
}
