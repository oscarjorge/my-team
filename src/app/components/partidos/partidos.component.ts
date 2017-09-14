import { Component, OnInit } from '@angular/core';
import { Partido } from '../../interfaces/partido.interface';
import { Torneo } from '../../interfaces/torneo.interface';
import { Equipo } from '../../interfaces/equipo.interface';
import { TorneosService } from '../../services/torneos.service';
import { EquiposService } from '../../services/equipos.service';
import { PartidosService } from '../../services/partidos.service';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent implements OnInit {
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
};
  forma: FormGroup;
  registros: Partido[];
  equipos: Equipo[];
  torneos: Torneo[];
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
    Torneo:null,
    $key:null
  };
  constructor(private _service: PartidosService,
    private _equiposService: EquiposService,
    private _torneosService: TorneosService,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this._equiposService.getEquipos().subscribe(data => {
      this.equipos = data;
      this._torneosService.getRegistros().subscribe(data => {
        this.torneos = data;
        this._service.getRegistrosSinMapear().subscribe(data => {
          this.registros=[];
          data.forEach(registro => {
            //registro.EquipoLocal = this.equipos.filter(a=>a.$key == registro.EquipoLocal.$key)[0]
            
            let partido:Partido={};
            partido.Torneo = this.torneos.filter(a=>a.$key == registro.Torneo)[0]
            partido.EquipoLocal = this.equipos.filter(a=>a.$key == registro.EquipoLocal)[0]
            partido.EquipoVisitante = this.equipos.filter(a=>a.$key == registro.EquipoVisitante)[0]
            partido.$key = registro.$key;
            partido.Aplazado = registro.Aplazado;
            partido.Terminado = registro.Terminado;
            partido.Fecha = registro.Fecha;
            console.log(partido)
            this.registros.push(partido);
          });
          this.loading = false;
        });
      });
    });
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
        $key:null
      }
      this.forma = this._fb.group({
        equipoLocal: ['', [Validators.required]],
        equipoVisitante: ['', [Validators.required]],
        torneo: ['', [Validators.required]],
        fecha: ['', [Validators.required]],
        terminado: [false],
        aplazado: [false],
      });
    }

    else {
      this.nuevo = false;
      this.registro = registro;
      this.forma = this._fb.group({
        equipoLocal: [this.registro.EquipoLocal.$key, [Validators.required]],
        equipoVisitante: [this.registro.EquipoVisitante.$key, [Validators.required]],
        torneo: [this.registro.Torneo.$key, [Validators.required]],
        fecha: [this.registro.Fecha, [Validators.required]],
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
        console.log(this.forma.controls["fecha"].value)
        this._service.nuevoRegistro({
          EquipoLocal:this.forma.controls["equipoLocal"].value,
          EquipoVisitante:this.forma.controls["equipoVisitante"].value,
          Torneo:this.forma.controls["torneo"].value,
          Fecha:this.forma.controls["fecha"].value,
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
            EquipoLocal:this.forma.controls["equipoLocal"].value.$key,
            EquipoVisitante:this.forma.controls["equipoVisitante"].value.$key,
            Torneo:this.forma.controls["torneo"].value.$key,
            Fecha:this.forma.controls["fecha"].value,
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
}
