import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { JugadoresService } from '../../services/jugadores.service';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.component.html'
})
export class JugadorComponent {

  jugador:any = {};


  constructor( private activatedRoute: ActivatedRoute,
               private _jugadoresService: JugadoresService
    ){

    this.activatedRoute.params.subscribe( params =>{
    this._jugadoresService.getJugador(params['id']).then( data =>{
           console.log(data);
           this.jugador = data;
          
         })
    
// this._jugadoresService.getJugador(params['id'])
//         .subscribe( data =>{
//           console.log(data);
//           this.jugador = data;
          
//         })

 
     });

  }

}
