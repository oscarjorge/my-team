import { Component, OnInit } from '@angular/core';
import { JugadoresService } from '../../services/jugadores.service';
import { Jugador } from '../../interfaces/jugador.interface';
import { Router } from '@angular/router';
import { AuthFireBaseService } from '../../services/authFireBase.service';



@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html'
})
export class JugadoresComponent implements OnInit {

  loading: boolean = true;
  
  constructor(private _jugadoresService: JugadoresService,
    private _authService: AuthFireBaseService,
    private router: Router
  ) {
    // console.log("constructor");
  }
  ngOnInit() {
    this._jugadoresService.getJugadores()
        .subscribe(jugadores=>{
           this.loading=false;
        });
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
  isAuthAsync() {
    return this._authService.isAuthenticatedAsync();
  }

}
