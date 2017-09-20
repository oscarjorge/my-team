import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Clasificacion } from '../../interfaces/clasificacion.interface';
import { EquipoClasificacion } from '../../interfaces/clasificacion.interface';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  constructor(
    private _partidosService: PartidosService,
    private _usuariosService: UsuariosService
  ) { }



  equiposUsuario: any[];
  ngOnInit() {
    this._usuariosService.getEquiposUsuario().then(equipos => {
      let equiposKey: string[] = [];
      (<any[]>equipos).forEach(equipo => {
        this._partidosService.getRegistrosOrdenadosPorFechaFiltradoPorEquipo(equipo["$key"]).then(partidos => {
          (<any[]>partidos).forEach(partido => {
            var isafter = moment(partido["Fecha"]["formatted"], "DD/MM/YYYY").isAfter(moment(Date.now()));
            if (isafter && equipo["_proximoPartido"] == null) {
              equipo["_proximoPartido"] = partido;
            }
          });
        })
      });
      this.equiposUsuario = (<any[]>equipos);
      
    })

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
