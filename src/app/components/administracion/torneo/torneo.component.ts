import { Component, OnInit } from '@angular/core';
import { Torneo } from '../../../interfaces/torneo.interface';
import { TorneoFiltro } from '../../../interfaces/torneo.interface';
import { Sede } from '../../../interfaces/sede.interface';
import { Equipo } from '../../../interfaces/equipo.interface';
import { Grupo } from '../../../interfaces/grupo.interface';
import { Division } from '../../../interfaces/division.interface';
import { TorneosService } from '../../../services/torneos.service';
import { SedesService } from '../../../services/sedes.service';
import { DivisionesService } from '../../../services/divisiones.service';
import { GruposService } from '../../../services/grupos.service';
import { TemporadasService } from '../../../services/temporadas.service';
import { EquiposService } from '../../../services/equipos.service';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrls: ['./torneo.component.css']
})
export class TorneoComponent implements OnInit {

  forma: FormGroup;
  registros: Torneo[];
  registrosAll: Torneo[];
  sedes: Sede[];
  grupos: Grupo[];
  divisiones: Division[];
  temporadas: string[];
  equipos: Equipo[];
  loading: boolean = true;
  nuevo: boolean = false;
  mostrarPanel: boolean = false;
  id: string;
  private registro: Torneo = {
    Nombre: "",
    Sede: null,
    Grupo: null,
    Division: null,
    Temporada: "",
    Equipos: null

  }
  constructor(private _service: TorneosService,
    private _sedesService: SedesService,
    private _gruposService: GruposService,
    private _divisionesService: DivisionesService,
    private _temporadasService: TemporadasService,
    private _equiposService: EquiposService,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this._service.getRegistros().subscribe(data => {
      this.registros = data;
      this.registrosAll = data;
      this.loading = false;
    });
    this._equiposService.getEquipos().subscribe(data => {
      this.equipos = data;
    });
    this._sedesService.getRegistros().subscribe(data => {
      this.sedes = data;
    });
    this._gruposService.getRegistros().subscribe(data => {
      this.grupos = data;
    });
    this._divisionesService.getRegistros().subscribe(data => {
      this.divisiones = data;
    });
    this.temporadas = this._temporadasService.getRegistros();
  }
  mostrar(registro) {
    this.mostrarPanel = true;

    if (registro == null) {
      this.nuevo = true;
      this.registro = {
        Nombre: "",
        Sede: null,
        Grupo: null,
        Division: null,
        Temporada: "",
        Equipos: []

      }
    }

    else {
      this.nuevo = false;
      this.registro = registro;
    }


    this.forma = this._fb.group({
      nombre: [this.registro.Nombre, [Validators.required]],
      sede: [this.registro.Sede],
      grupo: [this.registro.Grupo],
      division: [this.registro.Division],
      temporada: [this.registro.Temporada, [Validators.required]],
      equipos: this._fb.array([])
    });

    this.initEquiposArr();

  }

  initEquiposArr() {
    let control: FormArray
    this.forma.controls['equipos'] = this._fb.array([]);
    this.registro.Equipos.forEach(element => {
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
      let a:FormArray=this._fb.array([]);
      control.controls.forEach(element => {
        let fg = <FormGroup>element;
        console.log(fg.controls['$key'].value +'-'+ equipo.$key)
        if(fg.controls['$key'].value!=equipo.$key)
          a.push(this._fb.group({
            nombre: [fg.controls['nombre'].value],
            escudo: [fg.controls['escudo'].value],
            $key: [fg.controls['$key'].value],
          }));
        
      });
      this.forma.controls['equipos']=a;
    }
  }
  esconder() {
    this.mostrarPanel = false;
  }
  eliminar(registro) {

    this._service.borrarRegistro(registro.$key).then(a => {

    }).catch(a => {
      alert(a);
    });
  }
  guardar() {
    if (this.forma.valid) {
      if (this.nuevo) {
        let equipos: any[] = [];
        (<FormArray>this.forma.controls['equipos']).controls.forEach(element => {
          let formelement = <FormGroup>element;
          let equipo = {
            Key: formelement.controls['$key'].value,
          }
          equipos.push(equipo)
        });
        this._service.nuevoRegistro({
          Nombre: this.forma.controls["nombre"].value,
          Sede: this.forma.controls["sede"].value,
          Grupo: this.forma.controls["grupo"].value,
          Division: this.forma.controls["division"].value,
          Temporada: this.forma.controls["temporada"].value,
          Equipos: equipos
        }).then(a => {
          this.esconder();
        }).catch(a => {
          alert(a);
        });
      }
      else {
        if (this.registro != null) {
          let equipos: any[] = [];
          (<FormArray>this.forma.controls['equipos']).controls.forEach(element => {
            let formelement = <FormGroup>element;

            console.log(formelement)
            let equipo = {
              Key: formelement.controls['$key'].value,
            }
            equipos.push(equipo)
          });
          this._service.actualizarRegistro({
            Nombre: this.forma.controls["nombre"].value,
            Sede: this.forma.controls["sede"].value,
            Grupo: this.forma.controls["grupo"].value,
            Division: this.forma.controls["division"].value,
            Temporada: this.forma.controls["temporada"].value,
            Equipos: equipos
          }, this.registro.$key).then(a => {
            this.esconder();
          }).catch(a => {
            alert(a);
          });
        }
      }
    }
    else
      console.log('no es valido')
  }
  
  filtroChanged(valor){
    let filtro = (<TorneoFiltro>valor);
    
    this.registros = this.registrosAll.filter(r=>
      r.Sede==((filtro.Sede!=null || filtro.Sede=="")?filtro.Sede:r.Sede) &&
      r.Grupo==((filtro.Grupo!=null)?filtro.Grupo:r.Grupo) &&
      r.Division==((filtro.Division!=null)?filtro.Division:r.Division) &&
      r.Temporada==((filtro.Temporada!=null)?filtro.Temporada:r.Temporada)
    )
  }
  
}
