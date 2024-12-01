import {Component, inject, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {BookService} from "../book.service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomSelectComponent} from "../custom-select/custom-select.component";
import {AuthorService} from "../author.service";
import {CategoryService} from "../category.service";
import {CustomCheckBoxSelectComponent} from "../custom-checkbox-select/custom-checkbox-select.component";
import {Book} from "../book";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomSelectComponent,
    CustomCheckBoxSelectComponent
  ],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.css'
})
export class BookEditComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected authors: string[] = [];
  protected title: string = '';
  protected categories: string[] = [];
  private readonly bookId: bigint| undefined;
  protected submitButton: string = '';
  protected imageLocation: string = '';
  private image: File | undefined;
  private bookService: BookService = inject(BookService);
  private authorService: AuthorService = inject(AuthorService);
  private categoryService: CategoryService = inject(CategoryService);

  bookEditForm: FormGroup = new FormGroup({
    image: new FormControl(null),
    title: new FormControl('', Validators.required),
    shortDescription: new FormControl('', Validators.maxLength(1000)),
    price: new FormControl(0, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]),
    discount: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(/^\d+$/)]),
    available: new FormControl(true, Validators.required),
    tags: new FormControl(null),
    authors: new FormControl([], [Validators.required, Validators.minLength(1)]),
    category: new FormControl('', Validators.required),
    releaseDate: new FormControl(null)
  });

  constructor(private titleService: Title, private router: Router) {
    const id = this.route.snapshot.params['id'];
    this.bookId = id ? BigInt(id) : undefined;
    this.submitButton = this.bookId ? 'Edit' : 'Save';
  }

  ngOnInit() {
    if (this.bookId) {
      this.bookService.getBook(this.bookId).subscribe(book => {
        this.imageLocation = book.image!;
        this.titleService.setTitle("Edit " + book.title);
        this.title = `Edit ${book.title}`;
        this.bookEditForm.setValue({
          image: null,
          title: book.title,
          shortDescription: book.shortDescription ?? '',
          price: book.price,
          discount: book.discount,
          available: book.available,
          tags: book.tags?.join(', '),
          authors: book.authors.map(aut => aut.fullName),
          category: book.category.name,
          releaseDate: book.releaseDate ? formatDate(book.releaseDate, "yyyy-MM-dd", "en-US") : ''
        });
      });
    } else
      this.title = 'Add new book';
    this.authorService.getAll().subscribe(authors => this.authors = authors.map(aut => aut.fullName).sort((a, b) => a.localeCompare(b)));
    this.categoryService.getAll().subscribe(categories => this.categories = categories.map(cat => cat.name).sort((a, b) => a.localeCompare(b)));
  }

  uploadFile(event: any) {
    if (!["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(event.target.files[0].type)) {
      alert("Invalid file types!");
      event.target.value = null;
      this.image = undefined;
      return;
    }
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.image!);
    reader.onload = () => {
      this.imageLocation = reader.result as string;
    }
  }

  handleSubmit() {
    let tags: string[] = [];
    if (this.bookEditForm.value.tags) {
      tags = this.bookEditForm.value.tags.split(',').map((tag: string) => tag.replace(/\s+/g, ""));
      if (tags.length > 0 && this.bookEditForm.value.tags.length > 0)
        tags = [this.bookEditForm.value.tags.replace(/\s+/g, "")];
      tags = tags.filter((tag: string) => tag.length > 0);
    }
    const book: Book = {
      title: this.bookEditForm.value.title,
      category: {name: this.bookEditForm.value.category},
      authors: this.bookEditForm.value.authors.map((aut: string) => { return {fullName: aut}; }),
      price: this.bookEditForm.value.price,
      discount: this.bookEditForm.value.discount,
      releaseDate: this.bookEditForm.value.releaseDate ? new Date(this.bookEditForm.value.releaseDate) : undefined,
      tags: tags,
      available: this.bookEditForm.value.available,
      shortDescription: this.bookEditForm.value.shortDescription.length > 0 ? this.bookEditForm.value.shortDescription : undefined,
    };
    if (!this.bookId) {
      this.bookService.createBook(book).subscribe(book => {
        if (this.image) {
          this.bookService.uploadImage(
            book.id!,
            this.image!
          ).subscribe(() => this.router.navigate(['/books', book.id]));
        } else {
          console.log(book);
        }
      });
    } else {
      this.bookService.updateBook(this.bookId, book).subscribe(book => {
        if (this.image) {
          this.bookService.uploadImage(
            book.id!,
            this.image!
          ).subscribe(() => this.router.navigate(['/books', book.id]));
        } else {
          this.router.navigate(['/books', book.id]);
        }
      });
    }
  }

  deleteImage() {
    if (this.image) {
      this.imageLocation = '';
      this.image = undefined;
      this.bookEditForm.get('image')?.reset();
    } else if (this.imageLocation.length > 0 && this.bookId) {
      this.bookService.deleteImage(this.bookId).subscribe(() => {
        this.imageLocation = '';
      })
    }
  }
}
