import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService} from "./auth.service"
import { AuthFireBaseService} from "./authFireBase.service"
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth:AuthService) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.auth.isAuthenticated();
  }
}
