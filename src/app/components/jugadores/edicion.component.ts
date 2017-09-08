
import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Jugador } from "../../interfaces/jugador.interface";
import { JugadoresService } from "../../services/jugadores.service";


 @Component({
   selector: 'app-edicion',
   templateUrl: './edicion.component.html',
   styles: []
 })
 export class EdicionJugadorComponent implements OnInit {

  private jugador:Jugador = {
    Nombre:"",
    Caracteristicas:"",
    Equipo:"Vividores",
    Imagen:"",
    Apodo:"",
  }

  nuevo:boolean = false;
  id:string;

  constructor(private _jugadoresService: JugadoresService,
              private router:Router,
              private route:ActivatedRoute ){

    this.route.params
        .subscribe( parametros=>{
          this.id = parametros['id']
          if( this.id !== "nuevo" ){
              this._jugadoresService.getJugador(this.id).then( data =>{
                  this.jugador = <Jugador> data;    
                })
          }
        });
  }

  ngOnInit() {
  }

  guardar(){
    if( this.id == "nuevo" ){
      console.log('insertando');
      // insertando
      this._jugadoresService.nuevoJugador( this.jugador )
      .then(res=>{
          this.router.navigate(['/jugador',res.key])
      })
      .catch((error)=>{
        console.error(error);        
        alert("Se ha producido un error.")
      })

    }else{
      //actualizando
      this._jugadoresService.actualizarJugador( this.jugador, this.id )
        .then( data=>{
                  this.router.navigate(['/jugadores'])
            },
            error=> console.error(error))
        .catch(()=>{alert("Se ha producido un error.")});
    }

  }

  agregarNuevo( forma:NgForm ){

    this.router.navigate(['/editarJugador','nuevo']);

    forma.reset({
      equipo:"Vividores"
    });

  }

}
