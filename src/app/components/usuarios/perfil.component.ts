
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
    jugadores = [];
    id: string;

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
    init(){
        this._equiposService.getEquipos()
        .subscribe(equipos => {
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
                    this.init();
                    //this.router.navigate(['home']);
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
            if(usuario!=null){
                if (usuario["Jugador"] != null) {
                    usuario["Jugador"] = jugador.$key;
                    
                    this._usuariosService.ActualizarUsuario(usuario, k)
                }
                else
                    this._usuariosService.ActualizarUsuario($.extend({}, usuario, { Jugador: jugador.$key }),k)
            }
            else
                alert("Se ha producido un error.")
            
        })
        
    }

}

