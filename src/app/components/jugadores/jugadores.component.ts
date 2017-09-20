import { Component, OnInit } from '@angular/core';
import { JugadoresService } from '../../services/jugadores.service';
import { Jugador } from '../../interfaces/jugador.interface';
import { Router } from '@angular/router';
import { AuthFireBaseService } from '../../services/authFireBase.service';
import { EquiposService } from '../../services/equipos.service';
import { UsuariosService } from '../../services/usuarios.service';


@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})
export class JugadoresComponent implements OnInit {

  loading: boolean = true;
  equipos: any[];
  jugadores: any[] = [];
  equiposUsuario: any[];
  jugadorUsuario: any;
  constructor(private _jugadoresService: JugadoresService,
    private _authService: AuthFireBaseService,
    private router: Router,
    private _equiposService: EquiposService,
    private _usuariosService: UsuariosService
  ) {

  }
  ngOnInit() {
    this._usuariosService.getUsuarioPromise().then(usu => {
      if(usu!=null){
        this.equiposUsuario = usu["Equipos"];
        this.jugadorUsuario = usu["Jugador"];
      }
        this._equiposService.getEquipos().subscribe(data => {
          this.equipos = data;
          this._jugadoresService.getJugadores()
            .subscribe(jugadores => {
              this.loading = false;
              //Solo enseñamos los jugadores de los equipos del usuario
              if(this.equiposUsuario!=null){
                jugadores.forEach(jugador => {
                  jugador.Equipos.forEach(eq => {
                    this.equiposUsuario.forEach(eqUsu => {
                      if (eq["Key"] == eqUsu["Key"])
                      {
                        if(this.jugadores.filter(j=>j.$key == jugador.$key).length==0)
                          this.jugadores.push(jugador);
                      }
                        
                    });
                    this.equipos.forEach(equ => {
                      if (eq.Key == equ.$key) {
                        eq.Escudo = equ.Escudo;
                      }
                    })
                  })
                })
              }
              
            });
        })
      
      
    })

  }

  verJugador(idx: number) {
    this.router.navigate(['/jugador', idx]);
  }
  editarJugador(idx: number) {
    this.router.navigate(['/editarJugador', idx]);
  }
  eliminarJugador(idx: number) {
    this._jugadoresService.borrarJugador(idx.toString())
      .then(() => { })
      .catch((a) => { alert("Se ha producido un error") });
  }


}
