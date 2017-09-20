
import { Injectable } from '@angular/core';
import { Torneo } from '../interfaces/torneo.interface';
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
        reject(reason); })
        );
    });
  }

  buscarRegistros(termino: string): Torneo[] {
    let registrosArr: Torneo[] = [];
    return registrosArr;
  }

}
