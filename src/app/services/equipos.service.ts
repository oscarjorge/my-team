
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';

@Injectable()
export class EquiposService {

    equipos: FirebaseListObservable<any[]>;

    constructor(private db: AngularFireDatabase, public afAuth: AngularFireAuth) {
        this.equipos = this.db.list('/equipos') as FirebaseListObservable<any[]>;
    }
    getEquipos(){
        this.equipos = this.db.list('/equipos');
        return this.equipos;
    }
    getEquipo(key) {
        

        let query = this.db.list('/equipos', {
            query: {
                orderByKey: true,
                equalTo: key
            }
        });
        return query;

    }
    // nuevoUsuario(usuario: Usuario) {
    //     let query = this.db.list('/usuarios', {
    //         query: {
    //             orderByChild: 'IdUnico',
    //             equalTo: usuario.IdUnico
    //         }
    //     });
    //     query.subscribe(queriedItems => {
    //         if (queriedItems.length == 0) {
    //             console.log(queriedItems.length);
    //             return this.usuarios.push(usuario);
    //         }
    //     });
    // }
}
