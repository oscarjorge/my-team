import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { JugadoresService } from '../../services/jugadores.service';
import { TorneosService } from '../../services/torneos.service';
import { EquiposService } from '../../services/equipos.service';
import { Clasificacion } from '../../interfaces/clasificacion.interface';
import { TorneoFiltro } from '../../interfaces/torneo.interface';
import { JugadorEstadisticas } from '../../interfaces/jugador.interface';
import { EquipoClasificacion } from '../../interfaces/clasificacion.interface';

@Component({
    selector: 'estadisticasJugador',
    templateUrl: 'estadisticasJugador.component.html',
    styleUrls:['estadisticasJugador.component.css']
})

export class EstadisticasJugadorComponent implements OnInit {
    @Input() jugadorKey: string;
    @Input() torneos: string[];
    
    estadisticas: any[];
    constructor(
        private _jugadoresService: JugadoresService,
        private _torneosService: TorneosService,
        private _equiposService: EquiposService
    ) { }
    ngOnChanges(changes: SimpleChanges) {
        this.estadisticas=null;
        this.getEstadisticas();
      }
    ngOnInit() {
        
    }
    getEstadisticas(){
        if(this.torneos){
            this.torneos.forEach(torneoInput => {
                this._torneosService.getRegistro(torneoInput).then(torneo=>{
                    this._jugadoresService.getEstadisticasJugadorPorTorneo(torneoInput, this.jugadorKey).then(est=>{
                        let e = {
                            torneo:torneo,
                            estJugador: est
                        }
                        if(this.estadisticas)
                            this.estadisticas.push(e)
                        else
                        this.estadisticas=[e]
                    }).catch(e=>{console.error('Ha ocurrido un error al mostrar las estadisticas del jugador')})
                    
        
                })
            });
        }
    }
    filtroChanged(filtro:TorneoFiltro){
        if(filtro.Torneo!=''){
            this._torneosService.getRegistro(filtro.Torneo).then(torneo=>{
                this._jugadoresService.getEstadisticasJugadorPorTorneo(filtro.Torneo, this.jugadorKey).then(est=>{
                   console.log(est);
                    this.estadisticas=[
                        {
                            torneo:torneo,
                            estJugador: est
                        }
                    ]
                }).catch(e=>{console.error('Ha ocurrido un error al mostrar las estadisticas del jugador')})
                

            })
        }
    }
}