import { Component, OnInit, DoCheck } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CamposService } from '../../services/campos.service';
import { TorneosService } from '../../services/torneos.service';
import { Clasificacion } from '../../interfaces/clasificacion.interface';
import { EquipoClasificacion } from '../../interfaces/clasificacion.interface';
import { TorneoFiltro } from '../../interfaces/torneo.interface';
import { AuthFireBaseService } from '../../services/authFireBase.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements DoCheck,OnInit {

  constructor(
    private _partidosService: PartidosService,
    private _usuariosService: UsuariosService,
    private _authService: AuthFireBaseService,
    private _camposService: CamposService,
    private _torneosService: TorneosService,
    
  ) { }

  torneos: string[] = [];
  partidos: any[];
  torneosEquipo: any[] = [];
  equipoUsuario: any;
  jugadorUsuario: string = localStorage.getItem('user_player');
  calendarioVisible:boolean = false;
  filtrosVisibles:boolean = false;
  initialize() {
    
    
    let e = localStorage.getItem('user_teams')
    if (e != null) {
      let equipoUsuarioActivo = (<any[]>JSON.parse(e)).find(e => e.Selected);
      this._torneosService.getRegistros().subscribe(torneos => {
        this.torneos = [];
        torneos.forEach(element => {
          if (element.Equipos.filter(e => e.Key == equipoUsuarioActivo.Key).length > 0) {
            this.torneosEquipo.push(element);
            this.torneos.push(element.$key);
          }

        });
        this._camposService.getRegistros()
          .subscribe(campos => {
            this._usuariosService.getEquiposUsuario().then(equipos => {
              (<any[]>equipos).forEach(equipo => {
                if (equipo["$key"] == equipoUsuarioActivo.Key) {
                  this.equipoUsuario = equipo;

                  this.torneosEquipo.forEach(torneoEquipo => {
                    this._partidosService.getRegistrosOrdenadosPorFechaFiltradoPorEquipo(this.equipoUsuario["$key"], torneoEquipo.$key).then(partidos => {
                      this.partidos=(<any[]>partidos);
                      (<any[]>partidos).forEach(partido => {
                        var isafter = moment(partido["Fecha"]["formatted"], "DD/MM/YYYY").isSameOrAfter(moment(Date.now()));
                        if (isafter && this.equipoUsuario["_proximoPartido"] == null) {
                          this.equipoUsuario["_proximoPartido"] = partido;
                          this.equipoUsuario["_proximoPartido"]["_campo"] = campos.find(c => c.$key == partido.Campo, 1);
                        }
                      });
                    })
                  });
                }
              });
            });
            
          })
      })
    }

  }

  ngDoCheck() {
    if(localStorage.getItem('user_teams')!=null && this.equipoUsuario!=null){
      if(this.equipoUsuario.$key!=JSON.parse(localStorage.getItem('user_teams')).find(e=>e.Selected==true).Key && !this.equipoUsuario.changed){
        this.equipoUsuario.changed = true;
        this.initialize();
      }
    }
  }
  ngOnInit() {
    let ini = this.initialize;
    $(window).bind('storage', function(e)
    {
      console.log(e.key);
      if (e.key == 'user_teams')
        ini();
    });
    this.initialize();
  }
  filtroChanged(filtro: TorneoFiltro) {
    if (filtro.Torneo != null && filtro.Torneo != '')
      this.torneos = [filtro.Torneo];
    else {
      let a: string[] = [];
      this.torneosEquipo.forEach(element => {
        a.push(element.$key);
      });
      this.torneos = a;
    }
  }

  isAuthAsync() {
    return this._authService.isAuthenticatedAsync();
  }













  // public lineChartData:Array<any> = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
  //   // {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  // ];
  // public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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
    // { // dark grey
    //   backgroundColor: 'rgba(77,83,96,0.2)',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // public randomize():void {
  //   let _lineChartData:Array<any> = new Array(this.lineChartData.length);
  //   for (let i = 0; i < this.lineChartData.length; i++) {
  //     _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
  //     for (let j = 0; j < this.lineChartData[i].data.length; j++) {
  //       _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
  //     }
  //   }
  //   this.lineChartData = _lineChartData;
  // }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
