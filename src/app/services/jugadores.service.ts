
import { Injectable } from '@angular/core';
import { Jugador, JugadorEstadisticas } from '../interfaces/jugador.interface';
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';
import { EquiposService } from './equipos.service';
@Injectable()
export class JugadoresService {

  jugadoresURL: string = "https://myteam-6f11c.firebaseio.com/jugadores.json";
  jugadorURL: string = "https://myteam-6f11c.firebaseio.com/jugadores";

  jugadores: FirebaseListObservable<any[]>;
  user: Observable<firebase.User>;

  constructor(private http: Http, private db: AngularFireDatabase, public afAuth: AngularFireAuth, private _equiposService: EquiposService) {
    this.user = afAuth.authState;
  }

  nuevoJugador(jugador: Jugador) {
    if (this.jugadores == null)
      this.jugadores = this.getJugadores();
    return this.jugadores.push(jugador);
  }

  actualizarJugador(jugador: Jugador, key$: string) {
    if (this.jugadores == null)
      this.jugadores = this.getJugadores();
    return this.jugadores.update(key$, jugador);
  }


  getJugador(key: string) {
    return new Promise((resolve, reject) => {
      this.db.object(`/jugadores/${key}`).subscribe(jug => {
        resolve(jug)
      });
    });

  }

  getJugadoresPorEquipo(keyEquipo) {
    return new Promise((resolve, reject) => {
      let jugadoresReturn: any[] = [];
      this.db.list('/jugadores').subscribe(jugadores => {
        jugadores.forEach(jugador => {
          if (jugador["Equipos"] != null && jugador["Equipos"].length > 0) {
            jugador["Equipos"].forEach(equipo => {
              if (equipo["Key"] == keyEquipo)
                jugadoresReturn.push(jugador);
            });
          }
        })
        resolve(jugadoresReturn);
      });
    });
  }
  getEstadisticasJugadorPorTorneo(torneoKey: string, jugadorKey:string) {
    return new Promise((resolve, reject)=>{
      let estadisticasJugador:JugadorEstadisticas={
        GolesMarcados:0,
        GolesEncajados:0,
        GolesPropiaPuerta:0,
        Amarillas:0,
        Rojas:0,
        Jugados:0,
        key$:jugadorKey
      };
      let query = this.db.list('/partidos', {
        query: {
          orderByChild: 'Torneo',
          equalTo: torneoKey
        }
      });
      query.subscribe(partidos=>{
        partidos.forEach(partido => {
          if(partido["Resultado"]){
            let estadisticas = (<any[]>partido["Resultado"]["JugadoresLocal"]).find(j=>j.KeyJugador==jugadorKey);
            if(!estadisticas)
              estadisticas = (<any[]>partido["Resultado"]["JugadoresVisitante"]).find(j=>j.KeyJugador==jugadorKey);
            if(estadisticas!=null){
              estadisticasJugador.GolesMarcados+=parseInt(estadisticas.GolesMarcados);
              estadisticasJugador.GolesEncajados+=parseInt(estadisticas.GolesEncajados);
              estadisticasJugador.Amarillas+=parseInt(estadisticas.Amarillas);
              estadisticasJugador.GolesPropiaPuerta+=parseInt(estadisticas.GolesPropiaPuerta);
              estadisticasJugador.Rojas+=parseInt(estadisticas.Rojas);
              estadisticasJugador.Jugados+=1;
            }
          }
        });
        resolve(estadisticasJugador);
      });
    })
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
