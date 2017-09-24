
import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Usuario } from "../../interfaces/usuario.interface";
import { UsuariosService } from "../../services/usuarios.service";
import { EquiposService } from "../../services/equipos.service";
import { JugadoresService } from "../../services/jugadores.service";
import { fundido } from '../animation'
declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-edicion',
    templateUrl: './perfil.component.html',
    styles: [],
    animations: [fundido]
})
export class PerfilComponent implements OnInit {
    textSearch: string = "";
    textSearchJug: string = "";
    usuario: Usuario;
    userName = localStorage.getItem('user_name');
    userPhoto = localStorage.getItem('user_photo');
    equipos: any[] = [];
    equiposAll: any[] = [];
    jugadores = [];
    id: string;
    equiposUsuario: any[];
    jugadorUsuario: any[];
    constructor(private _usuariosService: UsuariosService,
        private _equiposService: EquiposService,
        private _jugadoresService: JugadoresService,
        private router: Router,
        private route: ActivatedRoute) {

        this.route.params
            .subscribe(parametros => {
                this.id = parametros['id']
            });
    }

    ngOnInit() {
        this.init();
    }
    onChangeEquipoActivo(equipo) {
        this.equiposUsuario.forEach(element => {
            element["Selected"] = false;
            if (equipo.Key == element.Key)
                element["Selected"] = true;
        });
        localStorage.setItem('user_teams', JSON.stringify(this.equiposUsuario));
    }
    init() {
        let a = localStorage.getItem('user_teams');
        if (a != null)
            this.equiposUsuario = JSON.parse(a);
        this._equiposService.getEquipos()
            .subscribe(equipos => {
                this.equiposAll=equipos;
                this.equipos = [];
                this._usuariosService.getUsuario().subscribe(queriedItems => {
                    for (let equipo of equipos) {
                        this.equipos.push({ Error: "", Nombre: equipo.Nombre, Check: false, Password: "", $key: equipo.$key });
                        if (queriedItems.length > 0) {
                            this.usuario = queriedItems[0];
                            if (this.usuario.Equipos != null) {
                                for (let equipoUsuario of this.usuario.Equipos) {
                                    if (equipoUsuario != null && equipoUsuario.Key == equipo.$key) {
                                        this.equipos[this.equipos.length - 1].Check = true;
                                        this.equipos[this.equipos.length - 1].Password = equipo.Password;

                                        this._jugadoresService.getJugadoresPorEquipo(equipo.$key).then(jugEquipo => {

                                            (<any[]>jugEquipo).forEach(jugador => {

                                                if (this.jugadores.filter(a => a.$key == jugador.$key).length == 0) {
                                                    if (this.usuario.Jugador != null && this.usuario.Jugador == jugador.$key)
                                                        $.extend({}, jugador, { Jugador: jugador.$key })
                                                    this.jugadores.push(jugador)
                                                }
                                            });

                                        })
                                    }
                                }
                            }
                        }
                        else
                            this.usuario = null;
                    }
                });
            });
    }
    Guardar(key) {
        let pass = $("#" + key).val();
        if (pass != null && pass != '') {
            this._usuariosService.GuardarEquipoUsuario(key, $("#" + key).val())
                .then(data => {
                    if (data == 'Success!') {
                        let eqInsertado = this.equiposAll.find(e => e.$key == key);
                        let a = localStorage.getItem('user_teams');
                        let arre: any[] = [];
                        if (a == null) {
                            arre.push({
                                Nombre: eqInsertado.Nombre,
                                Escudo: eqInsertado.Escudo,
                                Key: eqInsertado.$key,
                                Selected: true
                            })
                        }
                        else {
                            <any[]>JSON.parse(a).forEach(s=>{
                                arre.push(s);
                            })
                            arre.push({
                                Nombre: eqInsertado.Nombre,
                                Escudo: eqInsertado.Escudo,
                                Key: eqInsertado.$key,
                                Selected: false
                            })
                        }
                        localStorage.setItem('user_teams',JSON.stringify(arre));
                    }
                    this.init();
                })
                .catch(data => {
                    this.equipos.filter(eq => {
                        return eq.$key == key
                    })[0].Error = data;
                });
        }
        else {
            this.equipos.filter(eq => {
                return eq.$key == key
            })[0].Error = 'error';
        }

    }
    Eliminar(key, pass) {
        this._usuariosService.EliminarEquipoUsuario(key, $("#" + key).val())
            .then(data => {
                if (data == 'Success!') {
                    let a = localStorage.getItem('user_teams');
                    let nuevoarr: any[] = [];
                    (<any[]>JSON.parse(a)).forEach(e => {
                        if (e.Key != key)
                            nuevoarr.push(e);
                    })
                    if (nuevoarr.length > 0)
                        localStorage.setItem('user_teams', JSON.stringify(nuevoarr));
                    else
                        localStorage.removeItem('user_teams');
                }
                this.init();
            })
            .catch(data => {
                this.equipos.filter(eq => {
                    return eq.$key == key
                })[0].Error = data;
            });
    }
    checkJugador(jugador) {
        this._usuariosService.getUsuarioPromise().then(usuario => {

            let k = usuario["$key"];
            if (usuario != null) {
                if (usuario["Jugador"] != null) {
                    usuario["Jugador"] = jugador.$key;

                    this._usuariosService.ActualizarUsuario(usuario, k)
                }
                else
                    this._usuariosService.ActualizarUsuario($.extend({}, usuario, { Jugador: jugador.$key }), k)
            }
            else
                alert("Se ha producido un error.")

        })

    }

}

