
import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';
import { EquiposService } from './equipos.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';

@Injectable()
export class UsuariosService {

    usuarios: FirebaseListObservable<any[]>;
    user: Observable<firebase.User>;

    constructor(private db: AngularFireDatabase, public afAuth: AngularFireAuth, private equiposService: EquiposService) {
        this.user = afAuth.authState;
        this.usuarios = this.db.list('/usuarios') as FirebaseListObservable<any[]>;
    }

    nuevoUsuario(usuario: Usuario) {
        let query = this.db.list('/usuarios', {
            query: {
                orderByChild: 'IdUnico',
                equalTo: usuario.IdUnico
            }
        });
        query.subscribe(queriedItems => {
            if (queriedItems.length == 0) {
                usuario.Rol="Normal";
                return this.usuarios.push(usuario);
            }
        });
    }
    getUsuario() {


        let query = this.db.list('/usuarios', {
            query: {
                orderByChild: 'IdUnico',
                equalTo: localStorage.getItem('uid')
            }
        });
        return query;

    }
    UpdateEquipoUsuario(datosUsuario) {

    }
    GuardarEquipoUsuario(key, pass) {
        return new Promise((resolve, reject) => {
            let finished = false;

            this.getUsuario().subscribe(datos => {
                if (!finished) {
                    if (datos && datos[0]) {
                        if (datos[0].Equipos) {
                            var equipoFinded = datos[0].Equipos.find(equipo => equipo.Key == key);
                            if (equipoFinded == null) {
                                this.equiposService.getEquipo(key).subscribe(datosEquipos => {
                                    if (datosEquipos && datosEquipos[0] && datosEquipos[0].Password == pass) {
                                        datos[0].Equipos.push({ 'Key': key });
                                        this.db.object('/usuarios/' + datos[0].$key)
                                            .update({ Equipos: datos[0].Equipos });
                                        finished = true;
                                        resolve('Success!');
                                    }
                                    else
                                        reject('La contraseña es incorrecta');
                                })
                            }
                            else
                                reject('No se ha encontrado el equipo');
                        }
                        else {
                            this.equiposService.getEquipo(key).subscribe(datosEquipos => {
                                if (datosEquipos && datosEquipos[0] && datosEquipos[0].Password == pass) {
                                    this.db.object('/usuarios/' + datos[0].$key)
                                        .update({ Equipos: [{ 'Key': key }] });
                                    finished = true;
                                    resolve('Success!');
                                }
                                else
                                    reject('No se ha encontrado el equipo');
                            })
                        }
                    }
                    else
                        reject('No existe el usuario o no está logado correctamente en el sistema');
                }
            });
        });
    }
    EliminarEquipoUsuario(key, pass) {
        return new Promise((resolve, reject) => {
            this.getUsuario().subscribe(datos => {
                if (datos && datos[0]) {
                    console.log('a');
                    if (datos[0].Equipos) {
                        console.log('b');
                        var equipos = datos[0].Equipos.filter(equipo => equipo.Key != key);
                        if (equipos == null){
                            console.log('c');
                            this.db.object('/usuarios/' + datos[0].$key)
                                .update({ Equipos: null });
                            resolve('Success!');
                        }
                        else {
                            this.db.object('/usuarios/' + datos[0].$key)
                                .update({ Equipos: equipos });
                            resolve('Success!');
                        }
                    }
                    else
                        reject('El usuario no tiene equipos asociados que borrar');
                }
                else
                    reject('No existe el usuario o no está logado correctamente en el sistema');
            });
        });
    }

}
