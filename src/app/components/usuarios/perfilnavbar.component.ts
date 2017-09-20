import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service'
import { JugadoresService } from '../../services/jugadores.service'
import { Usuario } from '../../interfaces/usuario.interface'
import { Jugador } from '../../interfaces/jugador.interface'

@Component({
    selector: 'perfilnavbar',
    templateUrl: './perfilnavbar.component.html',
    styleUrls: ['./perfilnavbar.component.css']
})

export class PerfilNavBarComponent implements OnInit {
    imagenPerfil: string = localStorage.getItem('user_photo');
    @Output() clickPerfil = new EventEmitter();
    @Output() clickOut = new EventEmitter();
    constructor(
        private _usuariosService: UsuariosService,
        private _jugadoresService: JugadoresService
    ) { }

    ngOnInit() {
        this._usuariosService.getUsuario().subscribe(usuario => {
            if (usuario != null && usuario.length == 1)
                if ((<Usuario>usuario[0]).Jugador != null)
                    this._jugadoresService.getJugador((<Usuario>usuario[0]).Jugador).then(j => {
                        this.imagenPerfil = (<Jugador>j).Imagen;

                    })
        })

    }
    clickImagen(){
        this.clickPerfil.emit();
    }
    clickIconOut(){
        this.clickOut.emit();
    }
}