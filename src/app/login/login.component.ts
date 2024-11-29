import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  protected invalid:boolean = false;
  private returnUrl: string = '';

  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
  }

  handleSubmit() {
    this.authService.login(
      this.signInForm.value.email,
      this.signInForm.value.password
    ).subscribe(result => {
      if (result) {
        this.returnUrl.length > 1 ? this.router.navigate([this.returnUrl], { replaceUrl: true }) : this.router.navigate([this.returnUrl]);
      } else {
        this.signInForm.reset();
        this.invalid = true;
      }
    });
  }
}
