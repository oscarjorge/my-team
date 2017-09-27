import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { Clasificacion } from '../../interfaces/clasificacion.interface';
import { EquipoClasificacion } from '../../interfaces/clasificacion.interface';

@Component({
    selector: 'clasificaciones',
    templateUrl: 'clasificaciones.component.html'
})

export class ClasificacionesComponent implements OnInit {
    @Input() equipoKey: string;
    @Input() torneos: string[];
    clasificaciones: any[]=[];
    constructor(
        private _partidosService: PartidosService
    ) { }
    ngOnChanges(changes: SimpleChanges) {
        
        this._partidosService.getClasificacion(this.equipoKey).then(clasifs => {
            let a =[];
            (<Clasificacion[]>clasifs).forEach(c => {
                this.torneos.forEach(element => {
                    if(c.TorneoKey==element){
                        
                        a.push(c);
                    }
                        
                });
                
            });
            this.clasificaciones=a;
            // this.clasificaciones = (<Clasificacion[]>clasifs)
            //  this.clasificaciones = (<Clasificacion[]>clasifs).filter(c => c.Temporada == this.temporada);
        });
        // console.log('a');
        // this.estadisticas=null;
        // this.getEstadisticas();
      }
    ngOnInit() {
        
    }
}