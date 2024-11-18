import {inject, Injectable} from '@angular/core';
import {Book} from './book';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, throwError} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "./cookie.service";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class BookService extends BaseService {

  constructor(private router: Router, httpClient: HttpClient, cookieService: CookieService) {
    super(httpClient, cookieService);
    this.url += "/books";
  }

  getAllBooks() {
    return this.httpClient.get<Book[]>(this.url).pipe(
      map(books => {
        return books.map(book => {
          book.image = `${this.url}/${book.id}/image`;
          return book;
        });
      })
    );
  }

  getBook(id: bigint) {
    return this.httpClient.get<Book>(this.url + `/${id}`).pipe(map(book => {
      book.image = `${this.url}/${id}/image`;
      return book;
    }),
      catchError(error => {
        if (error.status === 404)
          this.router.navigate(['/404']);
        return throwError(() => new HttpErrorResponse(error.statusText));
      }));
  }

  uploadImage(id: bigint, file: File) {
    let formData = new FormData();
    formData.append('image', file);
    return this.httpClient.post(this.url + `/${id}/image`, formData,
      { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` }, responseType: 'text'});
  }

  saveBook(book: Book) {
    this.httpClient.put<Book>(this.url + `/${book.id}`, book);
  }

  createBook(book: Book) {
    this.httpClient.put<Book>(this.url, book);
  }

  deleteBook(id: bigint) {
    return this.httpClient.delete<void>(this.url + `/${id}`);
  }

  addBookmark(id: bigint) {
    return this.httpClient.post<Book[]>(this.url + `/${id}/bookmark`, null,  { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  deleteBookmark(id: bigint) {
    return this.httpClient.delete<void>(this.url + `/${id}/bookmark`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }
}
