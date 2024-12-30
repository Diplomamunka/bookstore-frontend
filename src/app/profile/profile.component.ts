import {Component, OnInit} from "@angular/core";
import {User} from "../user";
import {AuthService} from "../auth.service";
import {RouterLink} from "@angular/router";
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
export class ProfileComponent implements OnInit {
  protected user!: User;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.loggedInUser.subscribe(user => this.user = user!);
  }
}
