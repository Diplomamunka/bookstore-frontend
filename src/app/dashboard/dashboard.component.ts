import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthService} from "../auth.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgForOf,
    RouterLinkActive,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  protected authService: AuthService = inject(AuthService);
  protected options: {option: string, url: string}[] = [];

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.authService.loggedInUser.subscribe(user => {
        this.options = this.authService.getProfileOptionsForUser();
        this.options.unshift({ option: 'Personal Information', url: 'profile' });
    });
  }
}
