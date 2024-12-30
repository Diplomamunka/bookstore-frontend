import {Injectable} from "@angular/core";
import {CanMatch, GuardResult, MaybeAsync, RedirectCommand, Route, Router, UrlSegment} from "@angular/router";
import {BookService} from "./book.service";
import {catchError, map, of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CanMatchBookService implements CanMatch {

  constructor(private bookService: BookService, private router: Router) {
  }

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    const idSegment = segments.find((segment: UrlSegment) => !isNaN(+segment.path));
    const id = idSegment ? BigInt(idSegment.path) : undefined;

    if (id) {
      return this.bookService.getBook(id).pipe(map(() => true),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 404)
              return of(new RedirectCommand(this.router.parseUrl('/404'), {replaceUrl: false}));
            else
              return of(false);
          }
        ));
    } else
      return false;
  }
}


