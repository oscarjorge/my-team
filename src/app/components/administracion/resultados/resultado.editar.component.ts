import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { PartidosService } from '../../../services/partidos.service';
import { EquiposService } from '../../../services/equipos.service';
import { JugadoresService } from '../../../services/jugadores.service';
import { fundido } from '../../animation'
declare var jQuery: any;
declare var $: any;
@Component({
    selector: 'app-edicionResultado',
    templateUrl: './resultado.editar.component.html',
    styleUrls: ['./resultado.editar.component.css'],
    animations: [fundido]
})

export class ResultadoEditarComponent implements OnInit {
    golesLocal: number = 0;
    golesVisitante: number = 0;
    idPartido: string;
    partido: any;
    equipoLocal: any;
    equipoVisitante: any;
    jugadoresLocal: any[];
    jugadoresVisitante: any[];

    forma: FormGroup;

    nuevo: boolean = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private _partidosService: PartidosService,
        private _equiposService: EquiposService,
        private _jugadoresService: JugadoresService,
        private _fb: FormBuilder) {
        this.route.params
            .subscribe(parametros => {
                _partidosService.getRegistro(parametros['id']).then(partido => {
                    this.partido = partido;
                    this.idPartido = this.partido.$key;
                    _equiposService.getEquipoPromise(partido["EquipoLocal"]).then(e => {
                        this.equipoLocal = e;
                        _jugadoresService.getJugadoresPorEquipo(e["$key"]).then(jugs => {
                            this.jugadoresLocal = <any[]>jugs;
                            _equiposService.getEquipoPromise(partido["EquipoVisitante"]).then(e => {
                                this.equipoVisitante = e;
                                _jugadoresService.getJugadoresPorEquipo(e["$key"]).then(jugs => {
                                    this.jugadoresVisitante = <any[]>jugs;

                                    this.forma = this._fb.group({
                                        jugadoresLocal: this._fb.array([]),
                                        jugadoresVisitante: this._fb.array([])
                                    });

                                    this.forma.controls['jugadoresLocal'] = this._fb.array([]);
                                    this.jugadoresLocal.forEach(element => {
                                        if (partido["Resultado"] != null) {
                                            let jug = partido["Resultado"]["JugadoresLocal"].filter(e => e.KeyJugador == element['$key'])[0];
                                            this.createFormGroup(<FormArray>this.forma.controls['jugadoresLocal'], element, jug);
                                        }
                                        else
                                            this.createFormGroup(<FormArray>this.forma.controls['jugadoresLocal'], element, null);
                                    });
                                    this.jugadoresVisitante.forEach(element => {
                                        if (partido["Resultado"] != null) {
                                            let jug = partido["Resultado"]["JugadoresVisitante"].filter(e => e.KeyJugador == element['$key'])[0];
                                            this.createFormGroup(<FormArray>this.forma.controls['jugadoresVisitante'], element, jug);
                                        }
                                        else
                                            this.createFormGroup(<FormArray>this.forma.controls['jugadoresVisitante'], element, null);
                                    });
                                })
                            });;
                        })
                    });


                }).catch(er => {
                    console.error(er)
                });
            });
    }
    createFormGroup(formArray: FormArray, jugador: any, jugEdit: any) {
        formArray.push(this._fb.group({
            $keyJugador: [jugador['$key']],
            imagen: [jugador['Imagen']],
            nombre: [jugador['Nombre']],
            amarillas: [(jugEdit) ? jugEdit['Amarillas'] : 0, [Validators.required, Validators.maxLength(2), Validators.pattern("[0-9]{1,2}")]],
            rojas: [(jugEdit) ? jugEdit['Rojas'] : 0, [Validators.required, Validators.maxLength(2), Validators.pattern("[0-9]{1,2}")]],
            golesMarcados: [(jugEdit != null) ? jugEdit['GolesMarcados'] : 0, [Validators.required, Validators.maxLength(2), Validators.pattern("[0-9]{1,2}")]],
            golesEncajados: [(jugEdit) ? jugEdit['GolesEncajados'] : 0, [Validators.required, Validators.maxLength(2), Validators.pattern("[0-9]{1,2}")]],
            golesPropiaPuerta: [(jugEdit) ? jugEdit['GolesPropiaPuerta'] : 0, [Validators.required, Validators.maxLength(2), Validators.pattern("[0-9]{1,2}")]],
            jugado: [(jugEdit) ? jugEdit['Jugado'] : true]
        }));
    }
    ngOnInit() { }

    guardar() {

        if (this.forma.controls['jugadoresLocal'].valid && this.forma.controls['jugadoresVisitante'].valid) {
            let res = {
                Resultado: {
                    JugadoresLocal: this.createJugadorBD(this.forma.controls["jugadoresLocal"]["controls"]),
                    JugadoresVisitante: this.createJugadorBD(this.forma.controls["jugadoresVisitante"]["controls"])
                }
            }

            this._partidosService.actualizarRegistro($.extend({}, this.partido, res), this.idPartido).then((a) =>
                this.router.navigate(['/partidos'])
            ).catch(a => { console.error(a), alert('Se ha producido un error') });
        }
    }
    createJugadorBD(grupo: any[]) {
        let jugadores: any[] = [];
        grupo.forEach(control => {
            jugadores.push({
                KeyJugador: control.controls["$keyJugador"].value,
                Amarillas: control.controls["amarillas"].value,
                Rojas: control.controls["rojas"].value,
                GolesMarcados: control.controls["golesMarcados"].value,
                GolesEncajados: control.controls["golesEncajados"].value,
                GolesPropiaPuerta: control.controls["golesPropiaPuerta"].value,
                Jugado: control.controls["jugado"].value
            })
        });
        return jugadores;
    }
    sumGolesLocal(valor) {
        this.golesLocal += parseInt(valor);
    }
    sumGolesVisitante(valor) {
        this.golesVisitante += parseInt(valor);
    }
}