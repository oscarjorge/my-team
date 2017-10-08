import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { SedesService } from '../../../services/sedes.service';
import { GruposService } from '../../../services/grupos.service';
import { DivisionesService } from '../../../services/divisiones.service';
import { TemporadasService } from '../../../services/temporadas.service';
import { TorneosService } from '../../../services/torneos.service';
import { TorneoFiltro } from '../../../interfaces/torneo.interface';

@Component({
    selector: 'buscador-torneos',
    templateUrl: './buscador-torneos.component.html'
})

export class BuscadorTorneosComponent implements OnInit {
    sedes: any[];
    grupos: any[];
    divisiones: any[];
    temporadas: any[];
    torneos: any[];
    @Output() onFiltroChanged = new EventEmitter();
    @Input() mostrarTorneo:boolean=false;
    torneosAll: any[];
    constructor(
        private _sedesService: SedesService,
        private _gruposService: GruposService,
        private _divisionesService: DivisionesService,
        private _temporadasService: TemporadasService,
        private _torneosService: TorneosService,
    ) { }

    ngOnInit() {
        this._sedesService.getRegistros().subscribe(sedes => {
            this._gruposService.getRegistros().subscribe(grupos => {
                this._divisionesService.getRegistros().subscribe(divisiones => {
                    this._torneosService.getRegistros().subscribe(torneos => {
                        this.sedes = sedes;
                        this.grupos = grupos;
                        this.divisiones  = divisiones;
                        this.temporadas = this._temporadasService.getRegistros();
                        this.torneos=torneos;
                        this.torneosAll= torneos;
                        let filtroVacio ={Nombre:"Seleccione...", $key:""};
                        this.sedes.splice(0, 0, filtroVacio);
                        this.grupos.splice(0, 0, filtroVacio);
                        this.divisiones.splice(0, 0, filtroVacio);
                        if(this.temporadas[0]!=null)
                            this.temporadas.splice(0, 0, null);
                        this.torneos.splice(0, 0, filtroVacio);
                    })
                })
            })
        })
    }
    filtros:TorneoFiltro={};
    onSedeChange(valor) {
        this.filtros.Sede=(valor=='')?null:valor;
        this.filtrarTorneo();
        this.onFiltroChanged.emit(this.filtros);
    }
    onGrupoChange(valor) {
        this.filtros.Grupo=(valor=='')?null:valor;
        this.filtrarTorneo();
        this.onFiltroChanged.emit(this.filtros);
    }
    onDivisionChange(valor) {
        this.filtros.Division=(valor=='')?null:valor;
        this.filtrarTorneo();
        this.onFiltroChanged.emit(this.filtros);
    }
    onTemporadaChange(valor) {
        this.filtros.Temporada=(valor==''||valor=='null')?null:valor;
        this.filtrarTorneo();
        this.onFiltroChanged.emit(this.filtros);
    }
    onTorneoChange(valor) {
        this.filtros.Torneo=(valor=='')?null:valor;
        this.onFiltroChanged.emit(this.filtros);
    }
    filtrarTorneo(){
        
        this.torneos=[];
        let filtro = (<TorneoFiltro>this.filtros);
        this.torneos = this.torneosAll.filter(r=>
          r.Sede==((filtro.Sede!=null || filtro.Sede=="")?filtro.Sede:r.Sede) &&
          r.Grupo==((filtro.Grupo!=null)?filtro.Grupo:r.Grupo) &&
          r.Division==((filtro.Division!=null)?filtro.Division:r.Division) &&
          r.Temporada==((filtro.Temporada!=null)?filtro.Temporada:r.Temporada)
        )
        
      }
}