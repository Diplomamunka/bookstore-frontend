import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Book} from "../book";
import {BookService} from "../book.service";
import {NgClass, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {User} from "../user";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-book-list-element',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './book-list-element.component.html',
  styleUrl: './book-list-element.component.css'
})
export class BookListElementComponent {
  @Input() book!: Book;
  @Input() disableScaling = false;
  protected user: User | undefined;
  protected bookmarked: boolean = false;
  protected bookmarkHovered: boolean = false;
  @Output() bookDeleted: EventEmitter<void> = new EventEmitter();
  @Output() bookmarkDeleted: EventEmitter<void> = new EventEmitter();

  constructor(private bookService: BookService, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.loggedInUser.subscribe(user => {
      if (user) {
        this.user = user;
        this.authService.getBookmarks().subscribe(bookmarks => {
          if (bookmarks.findIndex(book => book.id === this.book.id) !== -1) {
            this.bookmarked = true;
          }
        });
      }
    });
  }

  deleteBook() {
    this.bookService.deleteBook(this.book.id!).subscribe(() => this.bookDeleted.emit());
  }

  bookMarkBook() {
    if (this.bookmarked) {
      this.bookService.deleteBookmark(this.book.id!).subscribe(() => {
        this.bookmarked = false;
        this.bookmarkDeleted.emit();
      });
    } else {
      this.bookService.addBookmark(this.book.id!).subscribe(() => {
        this.bookmarked = true;
      });
    }
  }
}
