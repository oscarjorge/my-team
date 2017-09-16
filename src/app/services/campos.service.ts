
import { Injectable } from '@angular/core';
import { Campo } from '../interfaces/campo.interface';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
@Injectable()
export class CamposService {

    registros: FirebaseListObservable<any[]>;


    constructor(private db: AngularFireDatabase,
        public afAuth: AngularFireAuth) {

    }

    nuevoRegistro(registro: Campo) {
        return new Promise((resolve, reject) => {
            if (this.registros == null)
                this.registros = this.getRegistros();
            this.registros.push(registro).then(a => {
                resolve()
            }).catch(a => {
                reject(a)
            });

        })



    }

    actualizarRegistro(registro: Campo, key$: string) {
        return new Promise((resolve, reject) => {
            this.db.object('/campos/' + key$).update(registro).then(() => {
                resolve();
            }).catch((reason => {
                reject(reason);
            })
                );
        })
    }

    getRegistro(key: string) {
        return new Promise((resolve, reject) => {
            this.db.object(`/campos/${key}`).subscribe(reg => {
                resolve(reg)
            });
        });

    }

    getRegistros() {
        this.registros = this.db.list('/campos') as FirebaseListObservable<any[]>;
        return this.registros;
    }
    getRegistrosSinMapear() {
        return this.db.list('/campos') as FirebaseListObservable<any[]>;
    }

    borrarRegistro(key$: string) {
        return new Promise((resolve, reject) => {
            this.db.object('/campos/' + key$).remove().then(() => {
                resolve();
            }).catch((reason => {
                reject(reason);
            })
                );
        });
    }

    buscarRegistros(termino: string): Campo[] {
        let registrosArr: Campo[] = [];
        return registrosArr;
    }

}
