import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Equipo } from "../../interfaces/equipo.interface";
import { EquiposService } from "../../services/equipos.service";


@Component({
  selector: 'app-edicionequipo',
  templateUrl: './edicionequipo.component.html',
  styleUrls: ['./edicionequipo.component.css']
})
export class EdicionEquipoComponent implements OnInit {
  private equipo: Equipo = {
    Nombre: "",
    Escudo: "",
    Password: "",
  }
  nuevo: boolean = false;
  id: string;
  constructor(private _equiposService: EquiposService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params
      .subscribe(parametros => {
        this.id = parametros['id']
        if (this.id !== "nuevo") {
          this._equiposService.getEquipo(this.id).subscribe(data => {
            if (data && data[0]) 
            {
              this.equipo = <Equipo>data[0];
              this.equipo = data[0];
            }
              
          })
        }
        else
          this.nuevo=true;
      });
  }

  ngOnInit() {
    
  }
  guardar(forma:NgForm){
    console.log(forma)
    console.log(this.equipo)
    if(forma.valid)
      if(this.equipo.$key!=null)
        this._equiposService.update(this.equipo).then(data=>{
          this.router.navigate(['equipos']);
        }).catch(()=>{alert("Se ha producido un error")});
      else{
        this._equiposService.insert(this.equipo).then(data=>{
          this.router.navigate(['equipos']);
        }).catch(()=>{alert("Se ha producido un error")});;
      }
    
  }
}
