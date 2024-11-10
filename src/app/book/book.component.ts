import {Component, Input} from '@angular/core';
import { RouterLink } from '@angular/router';
import {CommonModule} from "@angular/common";
import {Book} from "../book";

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  @Input() book!: Book;
}
