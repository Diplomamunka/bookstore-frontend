import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  protected invalid:boolean = false;

  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router) {
  }

  handleSubmit() {
    this.authService.login(
      this.signInForm.value.email,
      this.signInForm.value.password
    ).subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate(['/']);
      } else {
        this.signInForm.reset();
        this.invalid = true;
      }
    });
  }
}
