import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "./cookie.service";

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected url: string = "http://localhost:8080/api";

  constructor(protected httpClient: HttpClient, protected cookieService: CookieService) {}

}
