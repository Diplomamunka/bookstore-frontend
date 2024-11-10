import { Component, inject } from '@angular/core';
import {BookComponent} from '../book/book.component';
import {CommonModule} from '@angular/common';
import {Book} from '../book';
import {BookService} from '../book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  bookList: Book[] = [];
  bookService: BookService = inject(BookService);

  constructor() {
  }

  ngOnInit() {
    this.bookService.getAllBooks().subscribe(books => this.bookList = books);
  }
}
