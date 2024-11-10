import {inject, Injectable} from '@angular/core';
import {Book} from './book';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, throwError} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "./cookie.service";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private url = 'http://localhost:8080/api/books';

  private cookieService = inject(CookieService);

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

  getBook(id: number) {
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

  uploadImage(id: number, file: File) {
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

  deleteBook(id: number) {
    this.httpClient.delete(this.url + `/${id}`);
  }

  constructor(private httpClient: HttpClient, private router: Router) {}
}
