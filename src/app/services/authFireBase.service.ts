
import { Injectable } from '@angular/core';
import { Jugador } from '../interfaces/jugador.interface';
import { Http, Headers } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';

import { UsuariosService } from './usuarios.service';
import { Usuario } from '../interfaces/usuario.interface'

@Injectable()
export class AuthFireBaseService implements CanActivate {

  jugadores: FirebaseListObservable<any[]>;
  user: Observable<firebase.User>;
  public admin: boolean = false;
  public adminAsync;
  constructor(private db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private router: Router,
    private usService: UsuariosService) {
    this.user = afAuth.authState;
    this.isAuthenticatedAsync().subscribe(a => {
      if (a) {
        
        this.isAdmin().then(a => { this.admin = <boolean>a });
      }
      this.adminAsync = this.isAdmin();
    });
  }

  login() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(resp => {
      this.setSession(resp);
      let us: Usuario = {
        IdUnico: localStorage.getItem('uid'),
        Mail: localStorage.getItem('email'),
      }
      this.usService.nuevoUsuario(us);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('uid');
    localStorage.removeItem('mail');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_photo');
    this.adminAsync = this.isAdmin();
    // Go back to the home route
    this.router.navigate(['/']);
  }
  private setSession(authResult): void {
    localStorage.setItem('uid', authResult.user.uid);
    localStorage.setItem('email', authResult.user.mail);
    localStorage.setItem('user_name', authResult.user.displayName);
    localStorage.setItem('user_photo', authResult.user.photoURL);

  }

  isAuthenticatedAsync(): Observable<any> {
    return this.user; //auth is already an observable
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return localStorage.getItem('uid') != null;
  }
  isAdmin() {
    return new Promise((resolve, reject) => {
      let finished = false;
      this.usService.getUsuario().subscribe(datos => {
        if (!finished) {
          if (datos && datos[0]) {
            resolve(datos[0].Rol == "Administrador");
          }
          else
            resolve(false);
          finished = true;
        }
      });
    })
  }
}
