import {Component, inject, OnInit} from '@angular/core';
import {BookComponent} from '../book/book.component';
import {CommonModule} from '@angular/common';
import {Book} from '../book';
import {BookService} from '../book.service';
import {debounceTime, of, Subject, switchMap} from "rxjs";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  protected bookList: Book[] = [];
  protected filteredBookList: Book[] = [];
  private bookService: BookService = inject(BookService);
  private searchSubject: Subject<string> = new Subject();

  ngOnInit() {
    this.bookService.getAllBooks().subscribe(books => {
      this.bookList = books.sort((a, b) => {
        if (a.id! < b.id!)
          return -1;
        if (a.id! > b.id!)
          return 1;
        else
          return 0;
      });
      this.filteredBookList = books;
    });
    this.searchSubject.pipe(
      debounceTime(500),
      switchMap(search => this.filterBooks(search))
    ).subscribe(filteredBookList => {
      this.filteredBookList = filteredBookList;
    });
  }

  filterBooks(query: string) {
    return of(this.bookList.filter(book => book.title.toLowerCase().includes(query.toLowerCase())
    || book.authors.filter(author => author.fullName.toLowerCase().includes(query.toLowerCase())).length > 0));
  }

  onInput(query: string) {
    this.searchSubject.next(query);
  }
}
