import { Component, OnInit, DoCheck } from '@angular/core';
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
export class JugadoresComponent implements  DoCheck,OnInit {

  loading: boolean = true;
  equipo: any;
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
  initialize(){
    let e = localStorage.getItem('user_teams')
    if (e != null) {
      let d: any = (<any[]>JSON.parse(e)).find(e => e.Selected);
      this.equipo = d;
      this._jugadoresService.getJugadoresPorEquipo(d.Key).then(jugadores => {
        this.loading = false;
        this.jugadores = <any[]>jugadores;
      });
    }

  }
  ngDoCheck() {
    if(localStorage.getItem('user_teams')!=null && this.equipo!=null){
      if(this.equipo.Key!=JSON.parse(localStorage.getItem('user_teams')).find(e=>e.Selected==true).Key && !this.equipo.changed){
        this.equipo.changed = true;
        this.initialize();
      }
    }
  }
  ngOnInit() {
    this.initialize();
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
