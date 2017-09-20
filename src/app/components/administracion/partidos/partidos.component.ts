import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Partido } from '../../../interfaces/partido.interface';
import { Torneo } from '../../../interfaces/torneo.interface';
import { Equipo } from '../../../interfaces/equipo.interface';
import { TorneosService } from '../../../services/torneos.service';
import { EquiposService } from '../../../services/equipos.service';
import { PartidosService } from '../../../services/partidos.service';
import { CamposService } from '../../../services/campos.service';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";
import {IMyDpOptions} from 'mydatepicker';
import { fundido } from '../../animation'

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css'],
  animations: [fundido]
})
export class PartidosComponent implements OnInit {
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
};
  forma: FormGroup;
  registros: Partido[];
  todoslosequipos: Equipo[];
  equipos: Equipo[];
  torneos: Torneo[];
  horas=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
  minutos=["00","15","30","45"]
  loading: boolean = true;
  nuevo: boolean = false;
  mostrarPanel: boolean = false;
  id: string;
  private registro: Partido={
    EquipoLocal:null,
    EquipoVisitante:null,
    Aplazado:false,
    Terminado:false,
    Fecha:null,
    Hora:{Horas:"",Minutos:""},
    Torneo:null,
    $key:null
  };
  constructor(private _service: PartidosService,
    private _equiposService: EquiposService,
    private _torneosService: TorneosService,
    private _fb: FormBuilder,
    private router: Router,) { }

  ngOnInit() {

    this._equiposService.getEquipos().subscribe(equipos => {
      this.todoslosequipos = equipos;
      this.equipos = equipos;
      this._torneosService.getRegistros().subscribe(torneos => {
        this.torneos = torneos;

        this._service.getRegistrosOrdenadosPorFecha().then(partidos => {
          this.registros=[];
          
          (<any[]>partidos).forEach(registro => {
            let partido:Partido={};
            partido.Torneo = this.torneos.filter(a=>a.$key == registro.Torneo)[0]
            partido.EquipoLocal = this.todoslosequipos.filter(a=>a.$key == registro.EquipoLocal)[0]
            partido.EquipoVisitante = this.todoslosequipos.filter(a=>a.$key == registro.EquipoVisitante)[0]
            partido.$key = registro.$key;
            partido.Aplazado = registro.Aplazado;
            partido.Terminado = registro.Terminado;
            partido.Fecha = registro.Fecha;
            partido.Hora = {Horas:registro.Hora.Horas,Minutos:registro.Hora.Minutos};
            this.registros.push(partido);
          });
          this.loading = false;
        });
      });
    });
  }
  mostrarResultados(registro){
    this.router.navigate(['admninistracion/editarResultado', registro.$key]);
  }
  mostrar(registro) {
    this.mostrarPanel = true;

    if (registro == null) {
      this.nuevo = true;
      this.registro = {
        EquipoLocal:null,
        EquipoVisitante:null,
        Aplazado:false,
        Terminado:false,
        Fecha:null,
        Torneo:null,
        Hora:{Horas:"",Minutos:""},
        $key:null
      }
      this.forma = this._fb.group({
        equipoLocal: ['', [Validators.required]],
        equipoVisitante: ['', [Validators.required]],
        torneo: ['', [Validators.required]],
        fecha: ['', [Validators.required]],
        horas:['', [Validators.required]],
        minutos:['', [Validators.required]],
        terminado: [false],
        aplazado: [false],
      });
    }

    else {
      this.nuevo = false;
      this.registro = registro;
      this.onTorneoChange(this.registro.Torneo.$key);
      this.forma = this._fb.group({
        equipoLocal: [this.registro.EquipoLocal.$key, [Validators.required]],
        equipoVisitante: [this.registro.EquipoVisitante.$key, [Validators.required]],
        torneo: [this.registro.Torneo.$key, [Validators.required]],
        fecha: [this.registro.Fecha, [Validators.required]],
        horas: [this.registro.Hora.Horas, [Validators.required]],
        minutos: [this.registro.Hora.Minutos, [Validators.required]],
        terminado: [this.registro.Terminado],
        aplazado: [this.registro.Aplazado],
      });
    }
  }

  esconder() {
    this.mostrarPanel = false;
  }
  eliminar(registro) {
    console.log(registro.$key)
    this._service.borrarRegistro(registro.$key).then(a => {

    }).catch(a => {
      alert(a);
    });
  }
  guardar() {
    if (this.forma.valid) {
      if (this.nuevo) {
        this._service.nuevoRegistro({
          EquipoLocal:this.forma.controls["equipoLocal"].value,
          EquipoVisitante:this.forma.controls["equipoVisitante"].value,
          Torneo:this.forma.controls["torneo"].value,
          Fecha:this.forma.controls["fecha"].value,
          Hora:{Horas:this.forma.controls["horas"].value, Minutos:this.forma.controls["minutos"].value},
          Aplazado:this.forma.controls["aplazado"].value,
          Terminado:this.forma.controls["terminado"].value,
        }).then(a => {
          this.esconder();
        }).catch(a => {
          alert(a);
        });
      }
      else {
        if (this.registro != null) {
          this._service.actualizarRegistro({
            EquipoLocal:this.forma.controls["equipoLocal"].value,
            EquipoVisitante:this.forma.controls["equipoVisitante"].value,
            Torneo:this.forma.controls["torneo"].value,
            Fecha:this.forma.controls["fecha"].value,
            Hora:{Horas:this.forma.controls["horas"].value, Minutos:this.forma.controls["minutos"].value},
            Aplazado:this.forma.controls["aplazado"].value,
            Terminado:this.forma.controls["terminado"].value,
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
  onTorneoChange(value){
    this.equipos = this.torneos.find(t=>t.$key==value).Equipos;
    this.equipos=[]
    this.torneos.find(t=>t.$key==value).Equipos.forEach(eq => {
      this.equipos.push(this.todoslosequipos.find(e=>e.$key== eq["Key"]));
    });
  }
}
