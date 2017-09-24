
import { Injectable } from '@angular/core';
import { Torneo } from '../interfaces/torneo.interface';
import { TorneoDisplay } from '../interfaces/torneo.interface';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';
@Injectable()
export class TorneosService {

  registros: FirebaseListObservable<any[]>;


  constructor(private db: AngularFireDatabase,
    public afAuth: AngularFireAuth) {

  }

  nuevoRegistro(registro: Torneo) {
    return new Promise((resolve, reject) => {
      let query = this.db.list('/sedes', {
        query: {
          orderByChild: 'Nombre',
          equalTo: registro.Nombre
        }
      });
      query.subscribe(queriedItems => {
        if (queriedItems.length == 0) {
          if (this.registros == null) {
            this.registros = this.getRegistros();
          }
          this.registros.push(registro);
          resolve();
        }
        else {
          reject("Ya existe un registro con el mismo nombre.")
        }
      });
    })



  }

  actualizarRegistro(registro: Torneo, key$: string) {
    return new Promise((resolve, reject) => {
      let query = this.db.list('/torneos', {
        query: {
          orderByChild: 'Nombre',
          equalTo: registro.Nombre
        }
      });
      query.subscribe(queriedItems => {
        if ((queriedItems.length == 0) || (queriedItems.length == 1 && queriedItems[0].$key == key$)) {
          if (this.registros == null)
            this.registros = this.getRegistros();
          this.registros.update(key$, registro);
          resolve();
        }
        else {
          reject("Ya existe un registro con el mismo nombre.")
        }
      });
    });
  }

  getRegistro(key: string) {
    return new Promise((resolve, reject) => {
      this.db.object(`/torneos/${key}`).subscribe(reg => {
        resolve(reg)
      });
    });

  }

  getRegistros() {
    this.registros = this.db.list('/torneos') as FirebaseListObservable<any[]>;
    return this.registros;
  }
  getRegistrosDisplay() {
    return new Promise((resolve, reject) => {
      let torneosDisplay: TorneoDisplay[];
      this.db.list('/sedes').subscribe(sedes => {
        this.db.list('/grupos').subscribe(grupos => {
          this.db.list('/divisiones').subscribe(divisiones => {
            this.db.list('/torneos').subscribe(torneos => {
              torneos.forEach(torneo => {
                let sede = sedes.find(s=>s.$key==torneo.Sede);
                let grupo = grupos.find(s=>s.$key==torneo.Grupo);
                let division = divisiones.find(s=>s.$key==torneo.Division);
                let torneoDisplay: TorneoDisplay={
                  $key:torneo.$key,
                  Sede:(division!=null)?sede.Nombre:"",
                  Grupo:(division!=null)?grupo.Nombre:"",
                  Division:(division!=null)?division.Nombre:"",
                  Nombre: torneo.Nombre,
                  Temporada: torneo.Temporada
                }
                torneosDisplay.push(torneoDisplay);
              });
              resolve(torneosDisplay);
            })
          })
        })
      })
    })
  }
  getRegistrosOrdenadosPorNombre() {
    return new Promise((resolve, reject) => {
      let query = this.db.list('/torneos', {
        query: {
          orderByChild: 'Nombre',
        }
      });
      query.subscribe(queriedItems => {
        resolve(queriedItems);
      });
    });
  }
  borrarRegistro(key$: string) {
    return new Promise((resolve, reject) => {
      this.registros.remove(key$).then(() => {
        console.log('success')
        resolve();
      }).catch((reason => {
        console.log('error')
        reject(reason);
      })
        );
    });
  }

  buscarRegistros(termino: string): Torneo[] {
    let registrosArr: Torneo[] = [];
    return registrosArr;
  }

}
