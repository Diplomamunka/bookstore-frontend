import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookDetailsComponent } from './book-details/book-details.component';
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

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page - Boulevard of Chapters',
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
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up - Boulevard of Chapters',
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile - Boulevard of Chapters',
      },
      {
        path: 'profile/edit',
        component: ProfileEditComponent,
        title: 'Edit profile - Boulevard of Chapters',
      },
      {
        path: 'profile/bookmarks',
        component: BookmarksComponent,
        title: 'Bookmarks - Boulevard of Chapters',
      },
      /*{
        path: 'profile/orders',
        component: BookDetailsComponent,
        title: 'My orders - Boulevard of Chapters',
      },
      {
        path: 'orders',
        component: BookDetailsComponent,
        title: 'Manage orders - Boulevard of Chapters',
      },*/
      {
        path: 'users',
        component: UsersComponent,
        title: 'Manage users - Boulevard of Chapters',
      },
      {
        path: 'users/:login/edit',
        component: ProfileEditComponent,
        title: 'Edit user - Boulevard of Chapters',
      }
    ]
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: '404',
  },
  {
    path: '**',
    redirectTo: '/404',
  }
];
