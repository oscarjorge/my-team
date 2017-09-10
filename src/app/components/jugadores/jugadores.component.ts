import { Component, OnInit } from '@angular/core';
import { JugadoresService } from '../../services/jugadores.service';
import { Jugador } from '../../interfaces/jugador.interface';
import { Router } from '@angular/router';
import { AuthFireBaseService } from '../../services/authFireBase.service';
import { EquiposService } from '../../services/equipos.service';


@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html'
})
export class JugadoresComponent implements OnInit {

  loading: boolean = true;
  equipos: any[];
  jugadores:any[];
  constructor(private _jugadoresService: JugadoresService,
    private _authService: AuthFireBaseService,
    private router: Router,
    private _equiposService:EquiposService
  ) {
    
  }
  ngOnInit() {
    this._equiposService.getEquipos().subscribe(data => {
      this.equipos=data;
      this._jugadoresService.getJugadores()
      .subscribe(jugadores=>{
         this.loading=false;
        this.jugadores = jugadores;
        this.jugadores.forEach(jugador=>{
          jugador.Equipos.forEach(eq=>{
            this.equipos.forEach(equ=>{
              if(eq.Key==equ.$key){
                eq.Escudo = equ.Escudo;
              }
            })
          })
        })
      });
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
    .then(()=>{})
    .catch((a)=>{alert("Se ha producido un error")});
  }
  

}
