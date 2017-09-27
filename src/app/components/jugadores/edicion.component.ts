
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Jugador } from "../../interfaces/jugador.interface";
import { JugadoresService } from "../../services/jugadores.service";
import { EquiposService } from "../../services/equipos.service";
import { fundido } from '../animation'

@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styles: [],
  animations: [fundido]
})
export class EdicionJugadorComponent implements OnInit {

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
  textSearch:string="";
  constructor(private _jugadoresService: JugadoresService,
    private _equiposService: EquiposService,
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder) {

    this.route.params.subscribe(parametros => {
      this.id = parametros['id'];
    })

  }
  ngOnInit() {
    if (this.id !== "nuevo") {
      this._jugadoresService.getJugador(this.id).then(data => {
        this.jugador = <Jugador>data;

        this._equiposService.getEquipos().subscribe(data => {
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
            equipos: this._fb.array([])
          });
          this.initEquiposArr()

        })
      })
    }
    else {
      this.forma = this._fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        apodo: [''],
        imagen: [''],
        caracteristicas: [''],
        equipos: this._fb.array([])
      });
      this._equiposService.getEquipos().subscribe(data => {
        this.equipos = data;
      });

    }
  }
  initEquiposArr() {
    let control: FormArray
    this.forma.controls['equipos'] = this._fb.array([]);
    this.jugador.Equipos.forEach(element => {
      let e = this.equipos.filter(e => e.$key == element['Key'])[0];
      control = <FormArray>this.forma.controls['equipos'];
      control.push(this._fb.group({
        nombre: [e.Nombre],
        escudo: [e.Escudo],
        $key: [e.$key]
      }));
    });

    return control;
  }
  onCheckEquipo(e, equipo, index) {

    if (e.target.checked) {
      const control = <FormArray>this.forma.controls['equipos'];
      control.push(this._fb.group({
        nombre: [equipo.Nombre],
        escudo: [equipo.Escudo],
        $key: [equipo.$key]
      }));
    }
    else {
      const control = <FormArray>this.forma.controls['equipos'];
      let a: FormArray = this._fb.array([]);
      control.controls.forEach(element => {
        let fg = <FormGroup>element;

        if (fg.controls['$key'].value != equipo.$key)
          a.push(this._fb.group({
            nombre: [fg.controls['nombre'].value],
            escudo: [fg.controls['escudo'].value],
            $key: [fg.controls['$key'].value],
          }));

      });
      this.forma.controls['equipos'] = a;
    }
  }


  guardar() {
    if (this.forma.valid) {
      let equipos: any[] = [];
      (<FormArray>this.forma.controls['equipos']).controls.forEach(element => {
        equipos.push({ 'Key': (<FormGroup>element).controls["$key"].value });
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
              //this.router.navigate(['/jugador', res.key])
            })
            .catch((error) => {
              alert("Se ha producido un error.")
            })

        } else {
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




  }


}
