import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "./cookie.service";
import {Book} from "./book";
import {Author} from "./author";
import {catchError, map} from "rxjs";
import {BookService} from "./book.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseService {

  constructor(http: HttpClient, cookieService: CookieService) {
    super(http, cookieService);
    this.url += "/authors";
  }

  getAll() {
    return this.httpClient.get<Author[]>(this.url)
      .pipe(map(authors => authors.map(author => AuthorService.modifyAuthor(author))));
  }

  new(author: Author) {
    return this.httpClient.post<Author>(this.url, author, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
      .pipe(map(author => AuthorService.modifyAuthor(author)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409)
            alert(error.error);
          throw error;
        }));
  }

  delete(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 409)
          alert(error.error);
        throw error;
      }));
  }

  update(id: bigint, author: Author) {
    return this.httpClient.put<Author>(`${this.url}/${id}`, author, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
      .pipe(map(author => AuthorService.modifyAuthor(author)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409)
            alert(error.error);
          else if (error.status === 404)
            alert(error.error);
          throw error;
        }));
  }

  deleteAllBooks(id: bigint) {
    return this.httpClient.delete<void>(`${this.url}/${id}/books`, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
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

  public static modifyAuthor(author: Author) {
    author.id = author.id as bigint;
    return author;
  }
}
