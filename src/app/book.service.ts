import {Injectable} from '@angular/core';
import {Book} from './book';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, throwError} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "./cookie.service";
import {BaseService} from "./base.service";
import {AuthorService} from "./author.service";
import {CategoryService} from "./category.service";

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
          return BookService.modifyBook(book);
        });
      })
    );
  }

  getBook(id: bigint) {
    return this.httpClient.get<Book>(this.url + `/${id}`).pipe(map(book => {
      book.image = `${this.url}/${id}/image`;
      return BookService.modifyBook(book);
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

  updateBook(id: bigint, book: Book) {
    return this.httpClient.put<Book>(`${this.url}/${id}`, book, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(map(book => BookService.modifyBook(book)));
  }

  createBook(book: Book) {
    return this.httpClient.post<Book>(this.url, book, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(map(book => BookService.modifyBook(book)));
  }

  deleteBook(id: bigint) {
    return this.httpClient.delete<void>(this.url + `/${id}`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  addBookmark(id: bigint) {
    return this.httpClient.post<Book[]>(this.url + `/${id}/bookmark`, null,  { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } })
      .pipe(map(books => books.map(book => BookService.modifyBook(book))));
  }

  deleteBookmark(id: bigint) {
    return this.httpClient.delete<void>(this.url + `/${id}/bookmark`, { headers: { 'Authorization': `${this.cookieService.getCookie('TOKEN')}` } });
  }

  public static modifyBook(book: Book) {
    book.id = book.id as bigint;
    book.releaseDate = book.releaseDate ? new Date(book.releaseDate) : undefined;
    book.authors = book.authors.map(aut => AuthorService.modifyAuthor(aut));
    book.category = CategoryService.modifyCategory(book.category);
    return book;
  }
}
