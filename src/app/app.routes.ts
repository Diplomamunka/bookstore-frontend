import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
  RedirectCommand,
  RouterStateSnapshot,
  Routes,
  UrlTree
} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {BookDetailsComponent} from './book-details/book-details.component';
import {NotFoundComponent} from "./not-found/not-found.component";
import {LoginComponent} from "./login/login.component";
import {BookEditComponent} from "./book-edit/book-edit.component";
import {SignupComponent} from "./signup/signup.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProfileComponent} from "./profile/profile.component";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {UsersComponent} from "./users/users.component";
import {CategoriesComponent} from "./categories/categories.component";
import {AuthorsComponent} from "./authors/authors.component";
import {BookmarksComponent} from "./bookmarks/bookmarks.component";
import {AuthGuardService} from "./auth-guard.service";
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";
import {User} from "./user";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {BooksComponent} from "./books/books.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page - Boulevard of Chapters',
  },
  {
    path: 'books/new',
    component: BookEditComponent,
    title: 'New Book - Boulevard of Chapters',
    canActivate: [AuthGuardService],
    data: { requiredRoles: ['ADMIN', 'STAFF'] }
  },
  {
    path: 'books/:id',
    component: BookDetailsComponent,
    title: 'Book Details - Boulevard of Chapters',
  },
  {
    path: 'books/:id/edit',
    component: BookEditComponent,
    title: 'Book Edit - Boulevard of Chapters',
    canActivate: [AuthGuardService],
    data: { requiredRoles: ['ADMIN', 'STAFF'] }
  },
  {
    path: 'books',
    component: BooksComponent,
    title: 'Books - Boulevard of Chapters',
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    title: 'Categories - Boulevard of Chapters',
  },
  {
    path: 'authors',
    component: AuthorsComponent,
    title: 'Authors - Boulevard of Chapters',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign In - Boulevard of Chapters',
    canActivate: [(route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
      const authService: AuthService = inject(AuthService);

      if (authService.loggedInUser.getValue()) {
        const urlTree: UrlTree = route.root.component === null ? createUrlTreeFromSnapshot(route, ['/']) : createUrlTreeFromSnapshot(route, ['.']);
        return new RedirectCommand(urlTree, { replaceUrl: true });
      } else {
        return true;
      }
    }]
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up - Boulevard of Chapters',
    canActivate: [(route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
      const authService: AuthService = inject(AuthService);
      const currentUser: User | undefined = authService.loggedInUser.getValue();

      if (currentUser === undefined || currentUser.role === 'ADMIN') {
        return true;
      } else {
        const urlTree: UrlTree = route.root.component === null ? createUrlTreeFromSnapshot(route, ['/']) : createUrlTreeFromSnapshot(route, ['.']);
        return new RedirectCommand(urlTree, { replaceUrl: true });
      }
    }]
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile - Boulevard of Chapters',
        canActivate: [AuthGuardService],
        data: { requiredRoles: ['CUSTOMER', 'STAFF', 'ADMIN'] }
      },
      {
        path: 'profile/edit',
        component: ProfileEditComponent,
        title: 'Edit profile - Boulevard of Chapters',
        canActivate: [AuthGuardService],
        data: { requiredRoles: ['CUSTOMER', 'STAFF', 'ADMIN'] }
      },
      {
        path: 'profile/bookmarks',
        component: BookmarksComponent,
        title: 'Bookmarks - Boulevard of Chapters',
        canActivate: [AuthGuardService],
        data: { requiredRoles: ['CUSTOMER', 'STAFF', 'ADMIN'] }
      },
      {
        path: 'users',
        component: UsersComponent,
        title: 'Manage users - Boulevard of Chapters',
        canActivate: [AuthGuardService],
        data: { requiredRoles: ['ADMIN'] }
      },
      {
        path: 'users/:login/edit',
        component: ProfileEditComponent,
        title: 'Edit user - Boulevard of Chapters',
        canActivate: [AuthGuardService],
        data: { requiredRoles: ['ADMIN'] }
      }
    ]
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: '404',
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'Unauthorized',
  },
  {
    path: '**',
    redirectTo: '/404',
  }
];
