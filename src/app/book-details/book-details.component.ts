import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BookService} from '../book.service';
import { Book } from '../book';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  private bookService = inject(BookService);
  private bookId: bigint;
  protected book!: Book;
  protected bookPrice: number = 0;

  constructor(private title: Title, private router: Router, private route: ActivatedRoute) {
    this.bookId = BigInt(this.route.snapshot.params['id']);
  }

  ngOnInit() {
    this.bookService.getBook(this.bookId).subscribe(book => {
      this.title.setTitle(book.title);
      this.book = book;
      this.bookPrice = Math.round(book.price - book.price * (book.discount / 100));
    });
  }

  handleDelete() {
    this.bookService.deleteBook(this.bookId).subscribe(() => this.router.navigate(['']));
  }
}
