import {Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import {CookieService} from "./cookie.service";
import {User} from "./user";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected cookieService: CookieService = inject(CookieService);
  protected authService: AuthService = inject(AuthService);
  protected user: User | undefined;
  protected profileOptions: { option: string, url: string }[] = [];
  title = 'Boulevard of Chapters'

  @ViewChild('profileDropDown')
  private profileDropDown: ElementRef | undefined;

  @ViewChild('dropDownButton')
  private dropDownButton: ElementRef | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.cookieService.getCookie('TOKEN')) {
          this.authService.logInSavedUser().subscribe(user => {
            this.user = user;
            this.profileOptions = this.authService.getProfileOptionsForUser();
          });
        }
      }
    });
  }

  handleSignOut() {
    this.authService.signout().subscribe(() => this.router.navigate(['/']));
  }

  toggleProfileOptions() {
    document.getElementById("profileDropDown")!.classList.toggle("show-dropDown");
    document.getElementById("dropDownButton")!.classList.toggle("showing-dropDown");
    document.getElementById("profile")!.classList.toggle("showing-dropDown");
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.cookieService.getCookie('TOKEN') && !this.profileDropDown!.nativeElement.contains(event.target) &&
        !this.dropDownButton!.nativeElement.contains(event.target)) {
      this.closeDropDown();
    } else if (this.cookieService.getCookie('TOKEN') && this.profileDropDown!.nativeElement.contains(event.target)) {
      this.closeDropDown();
    }
  }

  private closeDropDown() {
    let dropDowns = document.getElementsByClassName("dropDownContent");
    for (let i = 0; i < dropDowns.length; i++) {
      if (dropDowns[i].classList.contains("show-dropDown")) {
        dropDowns[i].classList.remove("show-dropDown");
      }
    }
    document.getElementById("dropDownButton")!.classList.remove("showing-dropDown");
    document.getElementById("profile")!.classList.remove("showing-dropDown");
  }
}
