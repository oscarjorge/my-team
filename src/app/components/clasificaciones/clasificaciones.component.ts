import { Component, OnInit, Input } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { Clasificacion } from '../../interfaces/clasificacion.interface';
import { EquipoClasificacion } from '../../interfaces/clasificacion.interface';

@Component({
    selector: 'clasificaciones',
    templateUrl: 'clasificaciones.component.html'
})

export class ClasificacionesComponent implements OnInit {
    @Input() equipoKey: string;
    @Input() temporada: string;
    clasificaciones: any[];
    constructor(
        private _partidosService: PartidosService
    ) { }

    ngOnInit() {
        this._partidosService.getClasificacion(this.equipoKey).then(clasifs => {
             this.clasificaciones = (<Clasificacion[]>clasifs).filter(c => c.Temporada == this.temporada);
        });
    }
}