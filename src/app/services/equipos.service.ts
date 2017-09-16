
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
    getEquipoPromise(key) {
        return new Promise((resolve, reject)=>{
            this.db.object('/equipos/' + key).subscribe(a=>{resolve(a)});
        })
    }
    getEscudoEquipo(key) {
        return new Promise((resolve, reject)=>{
            this.db.object('/equipos/' + key).subscribe(a=>{resolve(a.Escudo)});
        })
    }
    update(equipo):firebase.Promise<void>{
        return this.db.object('/equipos/' + equipo.$key)
        .update(equipo);
    }
    insert(equipo):firebase.database.ThenableReference{
        return this.db.list('/equipos').push(equipo);
    }
    delete(equipo):firebase.Promise<void>{
        return this.db.object('/equipos/' + equipo.$key)
        .remove();
    }
    deleteById(id):firebase.Promise<void>{
        return this.db.object('/equipos/' + id)
        .remove();
    }
    
}
