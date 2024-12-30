import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BookService} from "../book.service";
import {Book} from "../book";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../auth.service";
import {User} from "../user";

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  private bookId: bigint;
  protected bookmarked = false;
  protected bookmarkHovered = false;
  protected book!: Book;
  protected user: User | undefined;
  protected bookPrice: number = 0;

  constructor(private title: Title, private router: Router, private route: ActivatedRoute, private authService: AuthService,
              private bookService: BookService) {
    this.bookId = BigInt(this.route.snapshot.params['id']);
  }

  ngOnInit() {
    this.bookService.getBook(this.bookId).subscribe(book => {
      this.title.setTitle(book.title);
      this.book = book;
      this.bookPrice = Math.round(book.price - book.price * (book.discount / 100));
      this.authService.loggedInUser.subscribe(user => {
        this.user = user;
        if (user) {
          this.authService.getBookmarks().subscribe(bookmarks => {
            if (bookmarks.findIndex(book => book.id === this.book.id) !== -1) {
              this.bookmarked = true;
            }
          });
        }
      });
    });
  }

  handleDelete() {
    this.bookService.deleteBook(this.bookId).subscribe(() => this.router.navigate(['']));
  }

  bookMarkBook() {
    if (this.bookmarked) {
      this.bookService.deleteBookmark(this.book.id!).subscribe(() => {
        this.bookmarked = false;
      });
    } else {
      this.bookService.addBookmark(this.book.id!).subscribe(() => {
        this.bookmarked = true;
      });
    }
  }
}
