import {Component, OnInit} from "@angular/core";
import {CategoryService} from "../category.service";
import {BookListComponent} from "../book-list/book-list.component";
import {NgForOf, NgIf} from "@angular/common";
import {Category} from "../category";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../user";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    BookListComponent,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  protected categories!: Category[];
  protected user: User | undefined;

  addForm: FormGroup = new FormGroup({
    category: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, protected categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => this.categories = categories.sort((a, b) => a.name.localeCompare(b.name)));
    this.authService.loggedInUser.subscribe(loggedInUser => this.user = loggedInUser);
  }

  handleAdd() {
    this.categoryService.new({name: this.addForm.value.category}).subscribe(category => {
      this.categories.splice(this.sortedIndex(category), 0, category);
      this.addForm.reset();
    });
  }

  deleteCategory(id: bigint) {
    this.categoryService.delete(id).subscribe(() => this.categories = this.categories.filter(c => c.id !== id))
  }

  editCategory(title: string, id: bigint) {
    this.categoryService.update(id, {name: title}).subscribe(category => {
      this.categories[this.categories.findIndex(c => c.id === category.id)] = category;
    });
  }

  changeAdd() {
    if (!document.getElementById('add-form')?.classList.contains('show-form')) {
      document.getElementById('add-form')?.classList.add('show-form');
    } else {
      this.handleAdd();
    }
  }

  sortedIndex(value: Category) {
    let low = 0,
      high = this.categories.length;

    while (low < high) {
      const mid = (low + high) >>> 1;
      if (this.categories[mid].name.localeCompare(value.name) < 0) low = mid + 1;
      else high = mid;
    }
    return low;
  }
}
