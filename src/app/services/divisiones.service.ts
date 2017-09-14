
import { Injectable } from '@angular/core';
import { Division } from '../interfaces/division.interface';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';
@Injectable()
export class DivisionesService {

  registros: FirebaseListObservable<any[]>;


  constructor(private db: AngularFireDatabase,
    public afAuth: AngularFireAuth) {

  }

  nuevoRegistro(registro: Division) {
    return new Promise((resolve, reject) => {
      let query = this.db.list('/divisiones', {
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

  actualizarRegistro(registro: Division, key$: string) {
    return new Promise((resolve, reject) => {
      let query = this.db.list('/divisiones', {
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
      this.db.object(`/divisiones/${key}`).subscribe(reg => {
        resolve(reg)
      });
    });

  }

  getRegistros() {
    this.registros = this.db.list('/divisiones') as FirebaseListObservable<any[]>;
    return this.registros;
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

  buscarRegistros(termino: string): Division[] {
    let registrosArr: Division[] = [];
    return registrosArr;
  }

}
