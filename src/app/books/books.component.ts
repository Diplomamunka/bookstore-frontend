import {Component, OnInit} from "@angular/core";
import {RouterLink} from "@angular/router";
import {BookListElementComponent} from "../book-list-element/book-list-element.component";
import {Book} from "../book";
import {BookService} from "../book.service";
import {NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../auth.service";
import {User} from "../user";

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    RouterLink,
    BookListElementComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  protected books!: Book[];
  protected user: User | undefined;

  constructor(private bookService: BookService, private authService: AuthService) {
  }

  ngOnInit() {
    this.bookService.getAllBooks().subscribe(books => this.books = books);
    this.authService.loggedInUser.subscribe(user => this.user = user);
  }

  handleBookDelete(id: bigint) {
    this.books.splice(this.books.findIndex(book => book.id === id), 1);
  }
}
