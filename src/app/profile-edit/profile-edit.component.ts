import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormControl, ReactiveFormsModule, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {NgClass, NgIf, Location, NgForOf} from "@angular/common";
import {User} from "../user";
import {CustomSelectComponent} from "../custom-select/custom-select.component";

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, NgForOf, CustomSelectComponent],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected authService: AuthService = inject(AuthService);
  protected user!: User;
  protected role: string = '';
  protected successful: string = '';

  profileEditForm: FormGroup = new FormGroup({
      firstName:  new FormControl('', [Validators.required, Validators.pattern("[A-Z][a-z]+")]),
      lastName: new FormControl('', [Validators.required, Validators.pattern("[A-Z][a-z]+")]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    (control: AbstractControl): ValidationErrors | null => {
      return control.value.password === control.value.password2 ? null : {PasswordNoMatch: true};
    }
  );

  constructor(private location: Location, private router: Router) {
  }

  ngOnInit() {
    this.authService.loggedInUser.subscribe(loggedInUser => {
      if (loggedInUser) {
        this.user = loggedInUser;
        this.role = loggedInUser.role!;

        if (this.route.snapshot.paramMap.has('login')) {
          this.authService.getUser(this.route.snapshot.params['login'])
            .subscribe(user => {
              if (loggedInUser.email === user.email) {
                this.user = loggedInUser;
                this.router.navigate(['/profile/edit']);
                this.updateForm();
              } else {
                this.user = user;
                this.updateForm(false);
              }
            });
        } else {
          this.updateForm();
        }
      }
    });
  }

  private updateForm(updateSelf: boolean = true) {
    if (this.role === 'ADMIN') {
      this.profileEditForm.addControl('role', new FormControl(this.user.role, [Validators.required]));
      if (!updateSelf) {
        this.profileEditForm.get('password')?.disable();
        this.profileEditForm.get('password2')?.disable();
      }
    }
    this.profileEditForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      role: this.user.role
    });
  }

  handleUpdate() {
    if (this.role === 'ADMIN') {
      this.authService.updateUser(
        {
          firstName: this.profileEditForm.value.firstName,
          lastName: this.profileEditForm.value.lastName,
          email: this.profileEditForm.getRawValue().email,
          password: ' ',
          role: this.profileEditForm.value.role
        }
      ).subscribe(() => this.location.back());
    } else {
      this.authService.update(
        {
          firstName: this.profileEditForm.value.firstName,
          lastName: this.profileEditForm.value.lastName,
          email: this.profileEditForm.getRawValue().email,
          password: this.profileEditForm.value.password
        }
      ).subscribe(() => this.location.back());
    }
  }
}
