import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync, RedirectCommand,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {AuthService} from "./auth.service";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const requiredRoles: string[] = route.data['requiredRoles'];
    const currentUser: User | undefined = this.authService.loggedInUser.getValue();

    if (!currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    } else if (requiredRoles.includes(currentUser.role!)) {
      return true;
    } else
      return new RedirectCommand(this.router.parseUrl('/unauthorized'));
  }
}
