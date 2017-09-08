
import { Injectable } from '@angular/core';
import { Jugador } from '../interfaces/jugador.interface';
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';

@Injectable()
export class JugadoresService {

  jugadoresURL: string = "https://myteam-6f11c.firebaseio.com/jugadores.json";
  jugadorURL: string = "https://myteam-6f11c.firebaseio.com/jugadores";

  jugadores: FirebaseListObservable<any[]>;
  user: Observable<firebase.User>;

  constructor(private http: Http, private db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  nuevoJugador(jugador: Jugador) {
    // return new Promise((resolve, reject) => {
    //   this.jugadores.push(jugador).then((a) => {
    //     resolve(a.key);
    //   });
    // });
    return this.jugadores.push(jugador);
  }

  actualizarJugador(jugador: Jugador, key$: string) {
    return this.jugadores.update(key$, jugador);
  }


  getJugador(key: string) {
    console.log(key);
    return new Promise((resolve, reject) => {
      this.db.object(`/jugadores/${key}`).subscribe(jug => {
        resolve(jug)
      });
    });

  }
  getJugadores() {
    this.jugadores = this.db.list('/jugadores') as FirebaseListObservable<any[]>;
    return this.jugadores;
  }

  borrarJugador(key$: string) {
    return new Promise((resolve, reject) => {
      this.jugadores.remove(key$).then(() => {
        resolve();
      }).catch((reason => { reject(reason); })
        );
    });


  }


  buscarJugadores(termino: string): Jugador[] {
    let jugadoresArr: Jugador[] = [];
    return jugadoresArr;
  }


  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
