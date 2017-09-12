
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";
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

  forma: FormGroup;
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
    private route: ActivatedRoute,
    private _fb: FormBuilder) {

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

            _equiposService.getEquipos().subscribe(data => {
              this.equipos = data;

              this.jugador.Equipos.forEach(equipoJugador => {
                equipoJugador.Escudo = this.equipos.filter(e => e.$key == equipoJugador.Key)[0].Escudo;
                equipoJugador.Nombre = this.equipos.filter(e => e.$key == equipoJugador.Key)[0].Nombre;
              });
              this.forma = this._fb.group({
                nombre: [this.jugador.Nombre, [Validators.required, Validators.minLength(3)]],
                apodo: [this.jugador.Apodo],
                imagen: [this.jugador.Imagen],
                caracteristicas: [this.jugador.Caracteristicas],
                equipos: this._fb.array([

                ])
              });
              this.initEquiposArr(this.jugador.Equipos)

            })
          })
        }
        else {
          _equiposService.getEquipos().subscribe(data => {
            this.equipos = data;
          })
        }

      });


    this.forma = new FormGroup({
      'nombre': new FormControl(''),
      'caracteristicas': new FormControl(''),
      'imagen': new FormControl(''),
      'apodo': new FormControl(''),
      'equipos': this._fb.array([
        this.initEquipos(),
      ])
    })
  }
  initEquipos() {

    return this._fb.group({
      nombre: [''],
      escudo: [''],
      key: ['']
    });

  }
  initEquiposArr(equipos) {

    equipos.forEach(element => {
      const control = <FormArray>this.forma.controls['equipos'];
      control.push(this._fb.group({
        nombre: [element.Nombre],
        escudo: [element.Escudo],
        key: [element.Key]
      }));

    });

  }
  onCheckEquipo(e, equipo, index) {

    if (e.target.checked) {
      const control = <FormArray>this.forma.controls['equipos'];
      control.push(this._fb.group({
        nombre: [equipo.Nombre],
        escudo: [equipo.Escudo],
        key: [equipo.$key]
      }));
    }
    else {
      const control = <FormArray>this.forma.controls['equipos'];
      control.removeAt(index);
    }
  }


  guardar() {
    if (this.forma.valid) {
      let equipos: any[] = [];
      (<FormArray>this.forma.controls['equipos']).controls.forEach(element => {
        equipos.push({ 'Key': (<FormGroup>element).controls.key.value });
      });
      if (equipos.length > 0) {
        this.jugador.Equipos = equipos;
        this.jugador.Nombre = this.forma.controls['nombre'].value;
        this.jugador.Imagen = this.forma.controls['imagen'].value;
        this.jugador.Caracteristicas = this.forma.controls['caracteristicas'].value;
        this.jugador.Apodo = this.forma.controls['apodo'].value;
        if (this.id == "nuevo") {
          // insertando 
          this._jugadoresService.nuevoJugador(this.jugador)
            .then(res => {
              this.router.navigate(['/jugador', res.key])
            })
            .catch((error) => {
              console.error(error);
              alert("Se ha producido un error.")
            })

        } else {
          console.log(this.jugador)
          //actualizando
          this._jugadoresService.actualizarJugador(this.jugador, this.id)
            .then(data => {
              this.router.navigate(['/jugadores'])
            },
            error => console.error(error))
            .catch(() => { alert("Se ha producido un error.") });
        }
      }
      else {
        alert("El jugador debe pertenecer por los menos a un quipo");
      }
    }
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
