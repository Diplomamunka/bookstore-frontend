import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Book} from "../book";
import {Author} from "../author";

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnChanges {
  @Input() book!: Book;
  protected bookPrice: number = 0;
  protected authors!: Author[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['book']) {
      this.bookPrice = Math.round(this.book.price - this.book.price * (this.book.discount / 100));
      this.authors = this.book.authors.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
  }
}
