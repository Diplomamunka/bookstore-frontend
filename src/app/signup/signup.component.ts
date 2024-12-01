import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormControl, ReactiveFormsModule, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CustomSelectComponent} from "../custom-select/custom-select.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, NgForOf, CustomSelectComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  protected authService: AuthService = inject(AuthService);
  protected title: string = '';
  protected successMessage: string = '';
  protected success: boolean = true;
  protected submitText: string = 'Sign up';
  protected role: string = '';
  private route: ActivatedRoute = inject(ActivatedRoute);

  signupForm: FormGroup = new FormGroup({
    firstName:  new FormControl('', [Validators.required, Validators.pattern("[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+")]),
    lastName: new FormControl('', [Validators.required, Validators.pattern("[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+")]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(8)])
    },
    (control: AbstractControl): ValidationErrors | null => {
      return control.value.password === control.value.password2 ? null : {PasswordNoMatch: true};
    }
  );

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.route.title.subscribe(title => {
      if (title) {
        if (this.route.snapshot.queryParamMap.has('add_new')) {
          title = "Add new user " + title.substring(title.indexOf("-"));
          this.signupForm.get('password')?.disable();
          this.signupForm.get('password2')?.disable();
          this.signupForm.addControl('role', new FormControl('CUSTOMER', Validators.required));
          this.submitText = 'Add new user';
          this.authService.loggedInUser.subscribe(loggedInUser => {
            if (loggedInUser) {
              this.role = loggedInUser.role!;
            }
          })
        }
        this.title = title.replace("-", "to");
      }
    });
  }

  handleSignUp() {
    if (this.role === 'ADMIN') {
      this.authService.signupUser(
        {
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          email: this.signupForm.value.email,
          password: ' ',
          role: this.signupForm.value.role,
        }
      ).subscribe(result => {
        if (result.success)
          this.signupForm.reset();
        this.successMessage = result.message;
        this.success = result.success;
      })
    } else {
      this.authService.signup(
        {
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
        }
      ).subscribe(result => {
        if (result.success) {
          this.router.navigate(['/login']);
        } else {
          this.successMessage = result.message;
        }
      });
    }
  }
}
