import { Component, OnInit } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface';
import { Sede } from '../../interfaces/sede.interface';
import { CamposService } from '../../services/campos.service';
import { SedesService } from '../../services/sedes.service';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";
import { GoogleMapsAPIWrapper } from '@agm/core';

@Component({
  selector: 'app-camposviewmap',
  templateUrl: './campos.viewmap.component.html',
  styleUrls: ['./campos.viewmap.component.css']
})
export class CamposViewMapComponent implements OnInit {

    marcadores:any[] =[];
    lat:number= 40.379327
    lng:number= -3.758227
    zoom:number=16;
    sedes: Sede[];
    campos: Campo[];
    campoSelected: Campo;
    map: any;
    constructor(private _service: CamposService,
        private _sedesService: SedesService,public gMaps: GoogleMapsAPIWrapper) { }
    ngOnInit() {
        this._sedesService.getRegistros().subscribe(data => {
            this.sedes = data;
        });
        this._service.getRegistros().subscribe(data => {
            this.campos = data;
            data.forEach(a=>{

                this.marcadores.push({
                    Latitud: parseFloat(a.Latitud),
                    Longitud: parseFloat(a.Longitud),
                    Titulo: a.Nombre,
                    Direccion: a.Direccion
                } )
            });
        });
        
    }
    populateCampos(e){
        this._service.getRegistros().subscribe(campo => {
            this.campos = [];
            campo.forEach(a=>{
                if(a.Sede==e.target.value)
                    this.campos.push(a);
            })
            
        });
    }
    public loadAPIWrapper(map) {
        console.log(map)
        this.map = map;
      }
    onchangeCampos(e){
         
         this.gMaps.setCenter({ lat: parseFloat(e.target.value.Latitud), lng: parseFloat(e.target.value.Longitud) });
        //  this.campoSelected =this.campos.filter(a=>a.$key==e.target.value)[0];
    }
}