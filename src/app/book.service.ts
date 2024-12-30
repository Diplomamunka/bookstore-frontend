import {Injectable} from "@angular/core";
import {Book} from "./book";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map} from "rxjs";
import {CookieService} from "./cookie.service";
import {BaseService} from "./base.service";
import {AuthorService} from "./author.service";
import {CategoryService} from "./category.service";

@Injectable({
  providedIn: 'root'
})
export class BookService extends BaseService {

  constructor(httpClient: HttpClient, cookieService: CookieService) {
    super(httpClient, cookieService);
    this.url += "/books";
  }

  getAllBooks() {
    return this.httpClient.get<Book[]>(this.url).pipe(
      map(books => {
        return books.map(book => BookService.modifyBook(book));
      })
    );
  }

  getBook(id: bigint) {
    return this.httpClient.get<Book>(this.url + `/${id}`).pipe(map(book => BookService.modifyBook(book)));
  }

  uploadImage(id: bigint, file: File) {
    let formData = new FormData();
    formData.append('image', file);
    return this.httpClient.post(this.url + `/${id}/image`, formData,
      {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}, responseType: 'text'})
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 500)
          alert("Couldn't upload the image to the book, try again!");
        else if (error.status === 400)
          alert(error.error);
        throw error;
      }));
  }

  deleteImage(id: bigint) {
    return this.httpClient.delete<void>(this.url + `/${id}/image`, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 500)
          alert("Couldn't delete the image, try again later!");
        throw error;
      }))
  }

  updateBook(id: bigint, book: Book) {
    return this.httpClient.put<Book>(`${this.url}/${id}`, book, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
      .pipe(map(book => BookService.modifyBook(book)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404)
            alert(error.error);
          throw error;
        }));
  }

  createBook(book: Book) {
    return this.httpClient.post<Book>(this.url, book, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
      .pipe(map(book => BookService.modifyBook(book)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404)
            alert(error.error);
          throw error;
        }));
  }

  deleteBook(id: bigint) {
    return this.httpClient.delete<void>(this.url + `/${id}`, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 500)
          alert("Couldn't delete book!");
        throw error;
      }));
  }

  addBookmark(id: bigint) {
    return this.httpClient.post<Book[]>(this.url + `/${id}/bookmark`, null, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}})
      .pipe(map(books => books.map(book => BookService.modifyBook(book))),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404)
            alert(error.error);
          throw error;
        }));
  }

  deleteBookmark(id: bigint) {
    return this.httpClient.delete<void>(this.url + `/${id}/bookmark`, {headers: {'Authorization': `${this.cookieService.getCookie('TOKEN')}`}});
  }

  public static modifyBook(book: Book) {
    book.image = `http://localhost:8080/api/books/${book.id}/image`;
    book.releaseDate = book.releaseDate ? new Date(book.releaseDate) : undefined;
    book.authors = book.authors.map(aut => AuthorService.modifyAuthor(aut));
    book.category = CategoryService.modifyCategory(book.category);
    return book;
  }
}
