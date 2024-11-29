import {Component, OnInit} from '@angular/core';
import {User} from "../user";
import {AuthService} from "../auth.service";
import {Book} from "../book";
import {BookListElementComponent} from "../book-list-element/book-list-element.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [
    BookListElementComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css'
})
export class BookmarksComponent implements OnInit {
  protected user: User | undefined;
  protected bookmarks: Book[] = [];

  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    this.authService.loggedInUser.subscribe(user => {
      this.user = user;
      this.authService.getBookmarks().subscribe(books => this.bookmarks = books.sort((a, b) => a.title.localeCompare(b.title)));
    });
  }

  handleBookmarkDelete(id: bigint) {
    this.bookmarks.splice(this.bookmarks.findIndex(book => book.id === id), 1);
  }

  handleBookDelete(id: bigint) {
    this.bookmarks.splice(this.bookmarks.findIndex(book => book.id === id), 1);
  }
}
