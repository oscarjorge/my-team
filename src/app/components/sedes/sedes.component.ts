import { Component, OnInit } from '@angular/core';
import { Sede } from '../../interfaces/sede.interface';
import { SedesService } from '../../services/sedes.service';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {

  forma: FormGroup;
  registros: Sede[];
  loading: boolean = true;
  nuevo: boolean = false;
  mostrarPanel: boolean = false;
  id: string;
  private registro: Sede = {
    Nombre: "",
  }
  constructor(private _service: SedesService,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this._service.getRegistros().subscribe(data => {
      console.log(data)
      this.registros = data;
      this.loading = false;
    });
  }
  mostrar(registro) {
    this.mostrarPanel = true;

    if (registro == null){
      this.nuevo = true;
      this.registro = {Nombre:""}
    }
      
    else {
      this.nuevo = false;
      this.registro = registro;
    }


    this.forma = this._fb.group({
      nombre: [this.registro.Nombre, [Validators.required]],
    });
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
          Nombre: this.forma.controls["nombre"].value
        }).then(a => {
          this.esconder();
         
        }).catch(a => {
          alert(a);
        });
      }
      else {
        if (this.registro != null) {
          console.log(this.registro);
          console.log(this.registro.$key);
          this._service.actualizarRegistro({
            Nombre: this.forma.controls["nombre"].value
          }, this.registro.$key).then(a => {
            this.esconder();
          }).catch(a => {
            alert(a);
          });
        }
      }
    }
  }
}
