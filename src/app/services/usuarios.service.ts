
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
                usuario.Rol = "Normal";
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
    getUsuarioPromise() {
        return new Promise((resolve, reject) => {
            let query = this.db.list('/usuarios', {
                query: {
                    orderByChild: 'IdUnico',
                    equalTo: localStorage.getItem('uid')
                }
            });
            query.subscribe(u => {
                if (u.length == 1)
                    resolve(u[0]);
                else
                    resolve(null);
            })
        });

    }
    UpdateEquipoUsuario(datosUsuario) {

    }
    GuardarEquipoUsuario(key, pass) {
        return new Promise((resolve, reject) => {
            this.getUsuarioPromise().then(usuario=>{
                let k = usuario["$key"];
                if (usuario!=null) {
                    if (usuario["Equipos"]) {
                        var equipoFinded = usuario["Equipos"].find(equipo => equipo.Key == key);
                        if (equipoFinded == null) {
                            this.equiposService.getEquipo(key).subscribe(datosEquipos => {
                                if (datosEquipos && datosEquipos[0] && datosEquipos[0].Password == pass) {
                                    usuario["Equipos"].push({ 'Key': key });
                                    this.db.object('/usuarios/' + k)
                                        .update({ Equipos: usuario["Equipos"] });
                                    
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
                                this.db.object('/usuarios/' + k)
                                    .update({ Equipos: [{ 'Key': key }] });
                                resolve('Success!');
                            }
                            else
                                reject('No se ha encontrado el equipo');
                        })
                    }
                }
                else
                    reject('No existe el usuario o no está logado correctamente en el sistema');
            })
        });

    }
    ActualizarUsuario(usuario, key$: string) {
        this.db.object('/usuarios/'+key$).update(usuario);
    }
    EliminarEquipoUsuario(key, pass) {
        return new Promise((resolve, reject) => {
            this.getUsuarioPromise().then(usuario=>{
                let k = usuario["$key"];
                if (usuario!=null) {
                    if (usuario["Equipos"]) {
                        var equipos = usuario["Equipos"].filter(equipo => equipo.Key != key);
                        if (equipos == null) {
                            this.db.object('/usuarios/' +k)
                                .update({ Equipos: null });
                            resolve('Success!');
                        }
                        else {
                            this.db.object('/usuarios/' + k)
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
