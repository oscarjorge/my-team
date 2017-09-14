
import { Injectable } from '@angular/core';
import { Partido } from '../interfaces/partido.interface';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';
@Injectable()
export class PartidosService {

  registros: FirebaseListObservable<any[]>;


  constructor(private db: AngularFireDatabase,
    public afAuth: AngularFireAuth) {

  }

  nuevoRegistro(registro: Partido) {
    return new Promise((resolve, reject) => {
      if (this.registros == null)
      this.registros = this.getRegistros();
          this.registros.push(registro).then(a=>{
            resolve()
          }).catch(a=>{
            reject(a)
          });
          
    })



  }

  actualizarRegistro(registro: Partido, key$: string) {
    return new Promise((resolve, reject) => {
      let query = this.db.list('/partidos', {
        query: {
          orderByKey: true,
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
      this.db.object(`/partidos/${key}`).subscribe(reg => {
        resolve(reg)
      });
    });

  }

  getRegistros() {
    this.registros = this.db.list('/partidos') as FirebaseListObservable<any[]>;
    return this.registros;
  }
  getRegistrosSinMapear() {
    return this.db.list('/partidos') as FirebaseListObservable<any[]>;
  }

  borrarRegistro(key$: string) {
    return new Promise((resolve, reject) => {
      if (this.registros == null)
        this.registros = this.getRegistros();
      this.registros.remove(key$).then(() => {
        console.log('success')
        resolve();
      }).catch((reason => { 
        console.log('error')
        reject(reason); })
        );
    });
  }

  buscarRegistros(termino: string): Partido[] {
    let registrosArr: Partido[] = [];
    return registrosArr;
  }

}
