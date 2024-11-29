import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {debounceTime, of, Subject, switchMap} from "rxjs";
import {NgClass, NgForOf} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-custom-checkbox-select',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgClass
  ],
  templateUrl: './custom-checkbox-select.component.html',
  styleUrl: './custom-checkbox-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomCheckBoxSelectComponent
    }
  ]
})
export class CustomCheckBoxSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  protected query: string = '';
  @Input() options: string[] = [];
  protected addedOptions: string[] = [];
  protected filteredOptions: string[] = [];
  protected selectedOptions: string[] = [];
  private searchSubject: Subject<string> = new Subject();
  protected highlightedIndex: number = -1;
  protected showSuggestionList: boolean = false;
  protected showSearched: boolean = false;
  onChange = (options: string[]) => {};
  onTouched = () => {};
  private touched: boolean = false;
  protected disabled: boolean = false;

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
    if (changes['options']) {
      this.filteredOptions = this.options;
    }
  }

  filterOptions(query: string) {
    if (query.length > 0)
      return of(this.options.filter(option => option.toLowerCase().includes(query.toLowerCase())));
    else
      return of(this.options);
  }

  onInput() {
    this.markAsTouched();
    if (!this.disabled) {
      this.searchSubject.next(this.query);
      if (this.query.indexOf(" ") !== -1 && this.query[this.query.length - 1] === ",") {
        this.addedOptions.push(this.query.split(',')[0]);
        this.query = '';
        this.onChange(this.selectedOptions.concat(this.addedOptions));
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    let element = event.target as HTMLElement;
    element = element.parentElement!.parentElement!.parentElement!.children.namedItem("suggestion-wrapper")!.children.namedItem("suggestion-list-container") as HTMLElement;

    if (event.key === 'ArrowDown') {
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredOptions.length - 1);
      element.scrollTop += 20;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
      element.scrollTop -= 20;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (!this.toggleHighlightedIndex() && this.query.indexOf(" ") !== -1) {
        this.addedOptions.push(this.query);
        this.query = '';
        this.onChange(this.selectedOptions.concat(this.addedOptions));
      }
      event.preventDefault();
    } else if (event.key === 'Backspace' && !this.query)
      this.removeLastAddedItem();
  }

  toggleHighlightedIndex() {
    this.markAsTouched();
    if (!this.disabled && this.highlightedIndex >= 0) {
      const selectedSuggestion = this.filteredOptions[this.highlightedIndex];

      if (!this.selectedOptions.includes(selectedSuggestion))
        this.selectedOptions.push(selectedSuggestion);
      else
        this.selectedOptions.splice(this.selectedOptions.indexOf(selectedSuggestion), 1);
      this.onChange(this.selectedOptions.concat(this.addedOptions));
      return true;
    } else
      return false;
  }

  toggleItem(suggestion: string) {
    this.markAsTouched();
    if (!this.disabled) {
      if (!this.selectedOptions.includes(suggestion))
        this.selectedOptions.push(suggestion);
      else {
        this.selectedOptions.splice(this.selectedOptions.indexOf(suggestion), 1);
      }
      this.onChange(this.selectedOptions.concat(this.addedOptions));
    }
  }

  showSelectedOptions() {
    this.filteredOptions = this.selectedOptions;
    this.showSuggestionList = true;
  }

  removeSelectedItem(item: string) {
    this.markAsTouched();
    if (!this.disabled) {
      this.addedOptions = this.addedOptions.filter(option => option !== item);
      this.onChange(this.addedOptions.concat(this.addedOptions));
    }
  }

  toggleSuggestions() {
    this.markAsTouched();
    if (!this.disabled) {
      this.showSuggestionList = !this.showSuggestionList;
      if (this.showSuggestionList)
        this.filteredOptions = this.options;
    }
  }

  removeLastAddedItem() {
    this.markAsTouched();
    if (!this.disabled && this.addedOptions.length > 0) {
      this.addedOptions.pop();
      this.onChange(this.selectedOptions.concat(this.addedOptions));
    }
  }

  writeValue(options: string[]): void {
    this.selectedOptions = options;
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
