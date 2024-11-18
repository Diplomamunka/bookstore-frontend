import { Component } from '@angular/core';
import {User} from "../user";
import {AuthService} from "../auth.service";
import {BookService} from "../book.service";
import {Book} from "../book";
import {BookListElementComponent} from "../book-list-element/book-list-element.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [
    BookListElementComponent,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css'
})
export class BookmarksComponent {
  protected user: User | undefined;
  protected bookmarks: Book[] = [];

  constructor(private authService: AuthService, private bookService: BookService) {

  }

  ngOnInit() {
    this.authService.loggedInUser.subscribe(user => {
      this.user = user;
      this.authService.getBookmarks().subscribe(books => this.bookmarks = books.sort((a, b) => a.title.localeCompare(b.title)));
    });
  }
}
