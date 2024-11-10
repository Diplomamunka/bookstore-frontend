import { Component } from '@angular/core';
import {User} from "../user";
import {AuthService} from "../auth.service";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  protected user: User | undefined;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.logInSavedUser().subscribe({
      next: user => this.user = user,
      error: () => this.router.navigate(['404'])
    });
  }
}
