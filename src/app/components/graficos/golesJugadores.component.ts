import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PartidosService } from '../../services/partidos.service';
import { JugadoresService } from '../../services/jugadores.service';
import { EquiposService } from '../../services/equipos.service';
import { TorneosService } from '../../services/torneos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Clasificacion } from '../../interfaces/clasificacion.interface';
import { EquipoClasificacion } from '../../interfaces/clasificacion.interface';


@Component({
  selector: 'graficoGolesJugadores',
  templateUrl: './golesJugadores.component.html',
  styles: []
})
export class GolesJugadoresComponent implements OnInit {

  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;
  public estadistica: string = "GolesMarcados";
  private ultimoFiltro: any = { Jugadores: [] = [], Torneo: "", Equipo:"" };
  constructor(
    private _partidosService: PartidosService,
    private _usuariosService: UsuariosService,
    private _jugadoresService: JugadoresService,
    private _equiposService: EquiposService,
    private _torneosService: TorneosService,
    private router: Router
  ) { }
  @Input() jugadorKey: string;
  hayTorneos:boolean=false;
  torneos: any[] = [];
  torneosAll: any[];
  jugadoresDelEquipo: any[] = [];
  ngOnInit() {
    if (this.jugadorKey != null) {
      let equiposUsuario = localStorage.getItem('user_teams')
      if (equiposUsuario != null) {
        let equipoSelected = (<any[]>JSON.parse(equiposUsuario)).find(e => e.Selected);
        this.ultimoFiltro.Equipo=equipoSelected.Key;
        this._torneosService.getRegistros().subscribe(torneosData => {
          if(torneosData.length>0){

            torneosData.forEach((element, index) => {
              if (element["Equipos"].find(e => e["Key"] == equipoSelected.Key) != null) {
                this.hayTorneos=true;
                //Dejamos en el filtro el primer torneo que aparezca
                if (this.torneos.length == 0)
                  this.ultimoFiltro.Torneo = element.$key;
                this.torneos.push(element);
              }
            });
            this._jugadoresService.getJugadoresPorEquipo(equipoSelected.Key).then(jugadores => {
              (<any[]>jugadores).forEach(jug => {
                this.jugadoresDelEquipo.push(jug);
                if (jug.$key == this.jugadorKey)
                  this.ultimoFiltro.Jugadores.push(jug);
              })
              this.dibujarGrafico()
            })
          }
        })
      }
    }
    else
      this.router.navigate(['/jugadores'])
  }
  onCheckJugador(e, jugador) {
    if (e.target.checked)
      this.ultimoFiltro.Jugadores.push(jugador);
    else {
      this.ultimoFiltro.Jugadores = this.ultimoFiltro.Jugadores.filter(function (obj) {
        return obj.$key !== jugador.$key;
      });
    }
    this.dibujarGrafico()
  }
  onTorneoChange(valor) {
    this.ultimoFiltro.Torneo = valor;
    this.dibujarGrafico()
  }
  onCheckEstadistica(e) {
    this.estadistica = e.target.value;
    this.dibujarGrafico()
  }
  
  dibujarGrafico() {
    this.lineChartData=null;
    let arrJugadoresEstadisticas: any[] = [];
    this.ultimoFiltro.Jugadores.forEach(jugador => {
      this._partidosService.getEstadisticasJugadores(this.ultimoFiltro.Torneo, jugador["$key"], this.estadistica, this.ultimoFiltro.Equipo).then(data => {
          arrJugadoresEstadisticas.push({ data: data["estadistica"], label: jugador["Nombre"] });
        if (arrJugadoresEstadisticas.length == this.ultimoFiltro.Jugadores.length) {
          this.lineChartLabels = data["jornadas"];
          this.lineChartData = arrJugadoresEstadisticas;
        }
      })

    })

  }
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }





}









