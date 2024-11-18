import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {debounceTime, of, Subject, switchMap} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.css'
})
export class CustomSelectComponent {
  protected query: string = '';
  @Input() options: string[] = [];
  protected filteredOptions: string[] = [];
  protected selectedOptions: string[] = [];
  @Input() multiSelectEnabled: boolean = true;
  private searchSubject: Subject<string> = new Subject();
  protected highlightedIndex: number = -1;
  protected showSuggestionList: boolean = false;
  protected showSearched: boolean = false;
  @Output() selected: EventEmitter<string[]> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.filteredOptions = this.options;
    this.searchSubject.pipe(
      debounceTime(500),
      switchMap(value => this.filterOptions(value))
    ).subscribe(filteredOptions => {
      this.filteredOptions = filteredOptions;
      this.highlightedIndex = -1;
      this.showSearched = this.query.length !== 0;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['option']) {
      this.filteredOptions = this.options;
    }
  }

  filterOptions(query: string) {
    return of(this.options.filter(option => option.toLowerCase().includes(query.toLowerCase())));
  }

  onInput() {
    this.searchSubject.next(this.query);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredOptions.length - 1);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
      event.preventDefault();
    }
    else if (event.key === 'Enter')
      this.selectHighlightedIndex();
    else if (event.key === 'Backspace' && !this.query)
      this.removeLastSelectedItem();
  }

  selectHighlightedIndex() {
    if (this.highlightedIndex >= 0) {
      const selectedSuggestion = this.filteredOptions[this.highlightedIndex];

      if (this.multiSelectEnabled) {
        if (!this.selectedOptions.includes(selectedSuggestion))
          this.selectedOptions.push(selectedSuggestion);
      } else
        this.selectedOptions = [selectedSuggestion];
    }

    this.query = '';
    this.filteredOptions = this.options.filter(option => !this.selectedOptions.includes(option));
    this.selected.emit(this.selectedOptions);
  }

  selectItem(suggestion: string) {
    if (this.multiSelectEnabled) {
      if (!this.selectedOptions.includes(suggestion))
        this.selectedOptions.push(suggestion);
    } else
      this.selectedOptions = [suggestion];

    this.query = '';
    this.filteredOptions = this.options.filter(option => !this.selectedOptions.includes(option));
    this.selected.emit(this.selectedOptions);
  }

  removeSelectedItem(item: string) {
    this.selectedOptions = this.selectedOptions.filter(option => option !== item);
    if (item.includes(this.query))
      this.filteredOptions.push(item);
  }

  toggleSuggestions() {
    this.showSuggestionList = !this.showSuggestionList;
  }

  removeLastSelectedItem() {
    if (this.selectedOptions.length > 0) {
      const item = this.selectedOptions.pop()!;
      if (item.includes(this.query))
        this.filteredOptions.push(item);
    }
  }
}
