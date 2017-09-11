
import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Jugador } from "../../interfaces/jugador.interface";
import { JugadoresService } from "../../services/jugadores.service";
import { EquiposService } from "../../services/equipos.service";


@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styles: []
})
export class EdicionJugadorComponent {

  forma:FormGroup;
  private jugador: Jugador = {
    Nombre: "",
    Caracteristicas: "",
    Equipos: [{}],
    Imagen: "",
    Apodo: "",
  }
  equipos: any[];
  nuevo: boolean = false;
  id: string;

  constructor(private _jugadoresService: JugadoresService,
    private _equiposService: EquiposService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params
      .subscribe(parametros => {
        this.id = parametros['id']
        if (this.id !== "nuevo") {
          this._jugadoresService.getJugador(this.id).then(data => {
            this.jugador = <Jugador>data;
            let arrEquipos = [];
            this.jugador.Equipos.forEach(element => {
              arrEquipos.push(new FormControl(element.Key));
            });
            console.log(arrEquipos)
            this.forma= new FormGroup({
              'nombre': new FormControl(this.jugador.Nombre, [Validators.required, Validators.minLength(3)]),
              'apodo': new FormControl(this.jugador.Apodo),
              'imagen': new FormControl(this.jugador.Imagen),
              'caracteristicas': new FormControl(this.jugador.Caracteristicas),
              'equipos': new FormArray(arrEquipos)
            })

            console.log(this.jugador)


            _equiposService.getEquipos().subscribe(data => {
              this.equipos=data;

              this.jugador.Equipos.forEach(equipoJugador => {
                equipoJugador.Escudo=this.equipos.filter(e=>e.$key==equipoJugador.Key)[0].Escudo;
                // this.equipos.forEach(equipo => {
                //   equipo.checked=(equipo.$key==equipoJugador.Key);
                //   equipoJugador.Escudo=(equipoJugador.Escudo==null)?equipo.Escudo:equipoJugador.Escudo;
                // });
              });
            })
          })
        }
        else{
          _equiposService.getEquipos().subscribe(data => {
            this.equipos = data;
          })
        }
        
      });
      this.forma= new FormGroup({
        'nombre': new FormControl(),
        'caracteristicas': new FormControl(),
        'imagen': new FormControl(),
        'apodo': new FormControl(),
        'equipos': new FormArray([new FormControl('aa')])
      })
  }
  agregarEquipo(equipo){
    (<FormArray>this.forma.controls['equipos']).push(new FormControl(equipo));
  }

  guardar() {
    console.log(this.forma.value)
    console.log(this.forma)
    // console.log(forma)
    // let equiposFiltrados=[];
    // for (var property in forma.controls) {
    //   if (forma.controls.hasOwnProperty(property)) {
    //     if (property.indexOf('equ_') >= 0)
    //       if (forma.controls[property].value == true) {
    //         let filtro = this.equipos.filter(eq => eq.Nombre == property.substring(property.indexOf('equ_') + 4, property.length));
    //         equiposFiltrados.push(filtro[0]);
    //       }
    //   }
    // }
    // if (equiposFiltrados != null && equiposFiltrados.length > 0) {
    //   this.jugador.Equipos = [];
    //   equiposFiltrados.forEach(equipo => {
    //     this.jugador.Equipos.push({
    //       'Key': equipo.$key
    //     })
    //   });
      
    //   if (this.id == "nuevo") {
    //     // insertando
    //     this._jugadoresService.nuevoJugador(this.jugador)
    //       .then(res => {
    //         this.router.navigate(['/jugador', res.key])
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //         alert("Se ha producido un error.")
    //       })

    //   } else {
    //     //actualizando
    //     this._jugadoresService.actualizarJugador(this.jugador, this.id)
    //       .then(data => {
    //         this.router.navigate(['/jugadores'])
    //       },
    //       error => console.error(error))
    //       .catch(() => { alert("Se ha producido un error.") });
    //   }
    // }
    // else {
    //   alert("El jugador debe pertenecer por los menos a un quipo");
    // }



  }

  // agregarNuevo(forma: NgForm) {

  //   this.router.navigate(['/editarJugador', 'nuevo']);

  //   forma.reset({
  //     equipo: "Vividores"
  //   });

  // }

}
