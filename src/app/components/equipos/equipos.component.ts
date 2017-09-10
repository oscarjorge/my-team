import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../services/equipos.service';
import { Jugador } from '../../interfaces/jugador.interface';
import { Router } from '@angular/router';
import { AuthFireBaseService } from '../../services/authFireBase.service';



@Component({
  selector: 'app-edicion-equipo',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {

  loading: boolean = true;
  textSearch:string="";
 
  constructor(private _equiposService: EquiposService,
    private _authService: AuthFireBaseService,
    private router: Router
  ) {
    
  }
  ngOnInit() {
    this._equiposService.getEquipos()
        .subscribe(equipos=>{
           this.loading=false;
        });
  }

  verEquipo(idx: number) {
    
    this.router.navigate(['/equipo', idx]);
  }
  editarEquipo(idx: number) {
    
    this.router.navigate(['/editarEquipo', idx]);
  }
  eliminarEquipo(idx: number) {
    this._equiposService.deleteById(idx).catch(()=>{alert("Se ha producido un error")});
  }
  isAuthAsync() {
    return this._authService.isAuthenticatedAsync();
  }
}

