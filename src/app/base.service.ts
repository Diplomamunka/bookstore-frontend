import {HttpClient} from "@angular/common/http";
import {CookieService} from "./cookie.service";

export abstract class BaseService {
  protected url: string = "http://localhost:8080/api";

  protected constructor(protected httpClient: HttpClient, protected cookieService: CookieService) {
  }
}
