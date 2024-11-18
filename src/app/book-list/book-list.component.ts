import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Book} from "../book";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {BookListElementComponent} from "../book-list-element/book-list-element.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../user";
import {Category} from "../category";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    NgForOf,
    BookListElementComponent,
    NgIf,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  @ViewChild('dropDownButton')
  private dropDownButton!: ElementRef;

  protected bookList: Book[] = [];
  @Input() title!: string;
  @Input() books!: Observable<Book[]>;
  protected showBooks: boolean = false;
  protected edit: boolean = false;
  @Input() bookDeleteFunction!: Observable<void>;
  @Input() user: User | undefined;
  @Input() editFunction!:() => Observable<string>;
  @Output() deleteClicked: EventEmitter<void> = new EventEmitter();
  @Output() changedCategory: EventEmitter<string> = new EventEmitter();

  protected editForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required)
  })

  ngOnInit() {
    this.books.subscribe(books => this.bookList = books);
    this.editForm.get('title')?.setValue(this.title);
  }

  toggleBooks($event: MouseEvent) {
    if (this.dropDownButton.nativeElement === $event.target) {
      this.showBooks = !this.showBooks;
    }
  }

  deleteBooks() {
    this.bookDeleteFunction.subscribe({
      next: () => this.bookList = [],
      error: err => {
        console.log(err);
        throw err;
      }
    });
  }

  handleDelete() {
    this.deleteClicked.emit();
  }

  handleBookDelete(id: bigint) {
    this.bookList = this.bookList.filter((book: Book) => book.id !== id);
  }

  changeTitle() {
    const newTitle = this.editForm.value.title;
    if (newTitle !== this.title)
      this.changedCategory.emit(this.editForm.value.title);
    this.edit = !this.edit;
  }

  handleEdit() {
    if (this.edit) {
      this.changeTitle();
    } else {
      this.edit = !this.edit;
    }
  }
}
