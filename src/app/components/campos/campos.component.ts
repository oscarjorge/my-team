import { Component, OnInit } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface';
import { Sede } from '../../interfaces/sede.interface';
import { CamposService } from '../../services/campos.service';
import { SedesService } from '../../services/sedes.service';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-campos',
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.css']
})
export class CamposComponent implements OnInit {

  forma: FormGroup;
  registros: Campo[];
  sedes: Sede[];
  loading: boolean = true;
  nuevo: boolean = false;
  mostrarPanel: boolean = false;
  id: string;
  private registro: Campo = {
    Nombre: null,
    Sede: null,
    Direccion: null,
    Latitud: null,
    Longitud: null,
    $key: null
  };
  constructor(private _service: CamposService,
    private _sedesService: SedesService,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this._sedesService.getRegistros().subscribe(data => {
      this.sedes = data;
      this._service.getRegistrosSinMapear().subscribe(data => {
        this.registros = [];
        data.forEach(registro => {
          //registro.EquipoLocal = this.equipos.filter(a=>a.$key == registro.EquipoLocal.$key)[0]

          let campo: Campo={Nombre: null};
          campo.Nombre = registro.Nombre;
          campo.Sede = this.sedes.filter(a => a.$key == registro.Sede)[0]
          campo.$key = registro.$key;
          campo.Direccion = registro.Direccion;
          campo.Latitud = registro.Latitud;
          campo.Longitud = registro.Longitud;
          
          this.registros.push(campo);
          
        });
        this.loading = false;
      });
    });
  }
  mostrar(registro) {
    this.mostrarPanel = true;

    if (registro == null) {
      this.nuevo = true;
      this.registro = {
        Nombre: null,
        Sede: null,
        Direccion: null,
        Latitud: null,
        Longitud: null,
        $key: null
      }
      this.forma = this._fb.group({
        nombre: ['', [Validators.required]],
        sede: ['', [Validators.required]],
        direccion: [''],
        latitud: [''],
        longitud: [''],
      });
    }

    else {
      this.nuevo = false;
      this.registro = registro;
      this.forma = this._fb.group({
        sede: [this.registro.Sede.$key, [Validators.required]],
        nombre: [this.registro.Nombre, [Validators.required]],
        direccion: [this.registro.Direccion],
        latitud: [this.registro.Latitud],
        longitud: [this.registro.Longitud],
      });
    }
  }


  esconder() {
    this.mostrarPanel = false;
  }
  eliminar(registro) {
    this._service.borrarRegistro(registro.$key)
    .then(a => {
    }).catch(a => {
      alert(a);
    });
  }
  guardar() {
    if (this.forma.valid) {
      if (this.nuevo) {
        this._service.nuevoRegistro({
          Sede: this.forma.controls["sede"].value,
          Nombre: this.forma.controls["nombre"].value,
          Direccion: this.forma.controls["direccion"].value,
          Latitud: this.forma.controls["latitud"].value,
          Longitud: this.forma.controls["longitud"].value,
        }).then(a => {
          this.esconder();
        }).catch(a => {
          alert(a);
        });
      }
      else {
        if (this.registro != null) {
          this._service.actualizarRegistro({
            Sede: this.forma.controls["sede"].value,
            Nombre: this.forma.controls["nombre"].value,
            Direccion: this.forma.controls["direccion"].value,
            Latitud: this.forma.controls["latitud"].value,
            Longitud: this.forma.controls["longitud"].value,
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
