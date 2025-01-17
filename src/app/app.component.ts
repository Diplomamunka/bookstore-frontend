import {Component, HostListener, OnInit} from "@angular/core";
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CookieService} from "./cookie.service";
import {User} from "./user";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, NgForOf, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected user: User | undefined;
  protected showDropDown: boolean = false;
  protected profileOptions: { option: string, url: string }[] = [];
  title = 'Boulevard of Chapters'

  constructor(private router: Router, protected cookieService: CookieService, private authService: AuthService) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.cookieService.getCookie('TOKEN')) {
          this.authService.loggedInUser.subscribe(user => {
            this.user = user;
            this.profileOptions = this.authService.getProfileOptionsForUser();
          });
        }
      }
    });
  }

  handleSignOut() {
    console.log("ASDASDS");
    this.authService.signOut().subscribe(() => {
      console.log("ASDADAS");
      this.router.navigate(['/']).then(() => window.location.reload());
    });
  }

  toggleProfileOptions() {
    this.showDropDown = !this.showDropDown;
  }

  @HostListener('window:click')
  onClick() {
    if (this.cookieService.getCookie('TOKEN') && this.showDropDown) {
      this.showDropDown = false;
    }
  }
}
