import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {debounceTime, of, Subject, switchMap} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

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
  styleUrl: './custom-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomSelectComponent
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  protected query: string = '';
  @Input() options: string[] = [];
  protected filteredOptions: string[] = [];
  protected selectedOption: string = '';
  private searchSubject: Subject<string> = new Subject();
  protected highlightedIndex: number = -1;
  protected showSuggestionList: boolean = false;
  protected showSearched: boolean = false;
  onChange = (option: string) => {};
  onTouched = () => {};
  private touched = false;
  protected disabled = false;

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      switchMap(value => this.filterOptions(value))
    ).subscribe(filteredOptions => {
      this.filteredOptions = filteredOptions;
      this.highlightedIndex = -1;
      this.showSearched = this.query.length !== 0;
      if (this.showSuggestionList && this.query.length === 0) {
        this.showSuggestionList = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = this.options;
    }
  }

  filterOptions(query: string) {
    return of(this.options.filter(option => option.toLowerCase().includes(query.toLowerCase())));
  }

  onInput() {
    this.markAsTouched();
    if (!this.disabled)
      this.searchSubject.next(this.query);
  }

  onKeyDown(event: KeyboardEvent) {
    let element = event.target as HTMLElement;
    element = element.parentElement!.parentElement!.parentElement!.children.namedItem("suggestion-wrapper")!.children.namedItem("suggestion-list-container") as HTMLElement;

    if (event.key === 'ArrowDown') {
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredOptions.length - 1);
      if (element.scrollTop < element.scrollHeight - element.clientHeight && this.highlightedIndex > 3)
        element.scrollTop += 20;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
      element.scrollTop -= 20;
      event.preventDefault();
    } else if (event.key === 'Enter')
      this.selectHighlightedIndex();
    else if (event.key === 'Backspace' && !this.query)
      this.removeSelectedItem();
  }

  selectHighlightedIndex() {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.highlightedIndex >= 0) {
        this.selectedOption = this.filteredOptions[this.highlightedIndex];
      }
      this.query = '';
      this.filteredOptions = this.options.filter(option => this.selectedOption != option);
      this.showSearched = this.showSuggestionList = false;
      this.onChange(this.selectedOption);
    }
  }

  selectItem(suggestion: string) {
    this.markAsTouched();
    if (!this.disabled) {
      this.selectedOption = suggestion;
      this.query = '';
      this.filteredOptions = this.options.filter(option => this.selectedOption != option);
      this.showSearched = this.showSuggestionList = false;
      this.onChange(this.selectedOption);
    }
  }

  removeSelectedItem() {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.selectedOption.includes(this.query))
        this.filteredOptions.push(this.selectedOption);
      this.selectedOption = '';
      this.onChange(this.selectedOption);
    }
  }

  toggleSuggestions() {
    this.markAsTouched();
    if (!this.disabled)
      this.showSuggestionList = !this.showSuggestionList;
  }

  writeValue(option: string): void {
    this.selectedOption = option;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
