import {Component, OnInit} from "@angular/core";
import {BookListComponent} from "../book-list/book-list.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../user";
import {AuthService} from "../auth.service";
import {AuthorService} from "../author.service";
import {Author} from "../author";

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [
    BookListComponent,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent implements OnInit {
  protected authors!: Author[];
  protected user: User | undefined;

  addForm: FormGroup = new FormGroup({
    author: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, protected authorService: AuthorService) {
  }

  ngOnInit() {
    this.authorService.getAll().subscribe(authors => this.authors = authors.sort((a, b) => a.fullName.localeCompare(b.fullName)));
    this.authService.loggedInUser.subscribe(loggedInUser => this.user = loggedInUser);
  }

  handleAdd() {
    this.authorService.new({fullName: this.addForm.value.author}).subscribe(author => {
      this.authors.splice(this.sortedIndex(author), 0, author);
      this.addForm.reset();
    });
  }

  deleteAuthor(id: bigint) {
    this.authorService.delete(id).subscribe(() => this.authors = this.authors.filter(a => a.id !== id))
  }

  editAuthor(author: string, id: bigint) {
    this.authorService.update(id, {fullName: author}).subscribe(author => {
      this.authors[this.authors.findIndex(a => a.id === author.id)] = author;
    });
  }

  changeAdd() {
    if (!document.getElementById('add-form')?.classList.contains('show-form')) {
      document.getElementById('add-form')?.classList.add('show-form');
    } else {
      this.handleAdd();
    }
  }

  sortedIndex(value: Author) {
    let low = 0,
      high = this.authors.length;

    while (low < high) {
      const mid = (low + high) >>> 1;
      if (this.authors[mid].fullName.localeCompare(value.fullName) < 0) low = mid + 1;
      else high = mid;
    }
    return low;
  }
}
