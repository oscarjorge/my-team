
import { Injectable } from '@angular/core';
import { Equipo } from '../interfaces/equipo.interface';
import { Partido } from '../interfaces/partido.interface';
import { Clasificacion } from '../interfaces/clasificacion.interface';
import { EquipoClasificacion } from '../interfaces/clasificacion.interface';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';
import { TorneosService } from '../services/torneos.service';
@Injectable()
export class PartidosService {

  registros: FirebaseListObservable<any[]>;


  constructor(
    private db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private _torneosService: TorneosService,
  ) {

  }

  nuevoRegistro(registro: Partido) {
    return new Promise((resolve, reject) => {
      if (this.registros == null)
        this.registros = this.getRegistros();
      this.registros.push(registro).then(a => {
        resolve()
      }).catch(a => {
        reject(a)
      });

    })



  }

  actualizarRegistro(registro: Partido, key$: string) {
    console.log(registro)
    return new Promise((resolve, reject) => {
      this.db.object('/partidos/' + key$)
        .update(registro)
        .then(() => {
          resolve();
        })
        .catch((reason => {
          reject(reason);
        })
        );
    });
  }


  getRegistro(key: string) {
    return new Promise((resolve, reject) => {
      this.db.object(`/partidos/${key}`).subscribe(reg => {
        resolve(reg)
      });
    });

  }
  getRegistrosOrdenadosPorFecha() {
    return new Promise((resolve, reject) => {
      this.db.list('/partidos').subscribe(queriedItems => {
        resolve(queriedItems.sort(function (a, b) {
          // return new Date(b["Fecha"]["epoc"]).getTime() - new Date(a["Fecha"]["epoc"]).getTime();
          return new Date(a["Fecha"]["epoc"]).getTime() - new Date(b["Fecha"]["epoc"]).getTime();
        }));
      });
    });
  }
  getRegistrosOrdenadosPorFechaFiltradoPorEquipo(equipoKey: string) {
    return new Promise((resolve, reject) => {
      let partidos = [] = [];
      let query = this.db.list('/partidos', {
        query: {
          orderByChild: 'EquipoLocal',
          equalTo: equipoKey
        }
      });
      query.subscribe(r => {
        partidos = partidos.concat(r);
        let query = this.db.list('/partidos', {
          query: {
            orderByChild: 'EquipoVisitante',
            equalTo: equipoKey
          }
        });
        query.subscribe(r => {
          partidos = partidos.concat(r);
          resolve(partidos.sort(function (a, b) {
            return new Date(a["Fecha"]["epoc"]).getTime() - new Date(b["Fecha"]["epoc"]).getTime();
          }));
        })
      })
    });
  }
  getClasificacion(equipoKey: string) {
    return new Promise((resolve, reject) => {
      let equiposMaestro: Equipo[];
      //Lo primero que hacemos es obtener todos los equipos para tener sus nombres
      this.db.list('/equipos').subscribe(equipos => {
        equiposMaestro = equipos;
        let query = this.db.list('/torneos', {
          query: {
            orderByKey: true,
          }
        });
        //serán todos los torneos donde participa el equipo
        let torneosEquipo: any[] = [];
        query.subscribe(torneos => {
          //Cogemos todos los torneos donde participa el equipo
          torneos.forEach(torneo => {
            if (torneo["Equipos"] != null)
              <any[]>torneo["Equipos"].forEach(equipo => {
                if (equipo.Key == equipoKey) {
                  torneosEquipo.push(torneo)
                  return;
                }
              })
          })

          let clasificaciones: Clasificacion[] = [];
          torneosEquipo.forEach(torneoEquipo => {
            let clasificacion: Clasificacion = {
              TorneoNombre: torneoEquipo["Nombre"],
              TorneoKey: torneoEquipo["$key"],
              Temporada:torneoEquipo["Temporada"],
              Equipos: []
            };
            //Por cada torneo cogemos todos los partidos
            query = this.db.list('/partidos', {
              query: {
                orderByChild: 'Torneo',
                equalTo: torneoEquipo['$key']
              }
            });
            query.subscribe(partidosPorTorneo => {
              //Nos recorremos los partidos del torneo
              partidosPorTorneo.forEach(partidoPorTorneo => {
                //Verificamos que el partido haya acabado y tenga un resultado
                if (partidoPorTorneo["Resultado"] != null) {
                  //Declaramos una variable que guardará los goles locales
                  let golesLocales: number = 0;
                  let golesVisitantes: number = 0;
                  //Si el partido tiene un resultado tiene que tener dos arrays: JugadoresLocal y JugadoresVisitante
                  //Si no es así se ha insertado mal
                  partidoPorTorneo["Resultado"]["JugadoresLocal"].forEach(jugadorLocal => {
                    golesLocales += jugadorLocal["GolesMarcados"] - jugadorLocal["GolesPropiaPuerta"]
                  });
                  partidoPorTorneo["Resultado"]["JugadoresVisitante"].forEach(jugadorVisitante => {
                    golesVisitantes += jugadorVisitante["GolesMarcados"] - jugadorVisitante["GolesPropiaPuerta"]
                  });
                  //Tratamos el equipoLocal
                  //Buscamos si ya se ha añadido el equipo a la clasificacion
                  let equipoLocal = clasificacion.Equipos.find(equipo => equipo.EquipoKey == partidoPorTorneo["EquipoLocal"])
                  if (equipoLocal == null) {
                    //Como aún no se ha añadido el equipo a la clasificacion, lo iniciamos
                    let equipo: EquipoClasificacion = {
                      EquipoKey: partidoPorTorneo["EquipoLocal"],
                      EquipoNombre: equiposMaestro.find(equMaestro => equMaestro.$key == partidoPorTorneo["EquipoLocal"]).Nombre,
                      GolesAFavor: golesLocales,
                      GolesEnContra: golesVisitantes,
                      Puntos: (golesLocales > golesVisitantes) ? 3 : (golesLocales < golesVisitantes) ? 0 : 1,
                      PartidosJugados: 1
                    }
                    clasificacion.Equipos.push(equipo);
                  }
                  else {
                    equipoLocal.GolesAFavor += golesLocales;
                    equipoLocal.GolesEnContra += golesVisitantes;
                    equipoLocal.Puntos += (golesLocales > golesVisitantes) ? 3 : (golesLocales < golesVisitantes) ? 0 : 1;
                    equipoLocal.PartidosJugados += 1;
                  }
                  //Tratamos el equipoLocal
                  //Buscamos si ya se ha añadido el equipo a la clasificacion
                  let equipoVisitante = clasificacion.Equipos.find(equipo => equipo.EquipoKey == partidoPorTorneo["EquipoVisitante"])
                  if (equipoVisitante == null) {
                    //Como aún no se ha añadido el equipo a la clasificacion, lo iniciamos
                    let equipo: EquipoClasificacion = {
                      EquipoKey: partidoPorTorneo["EquipoVisitante"],
                      EquipoNombre: equiposMaestro.find(equMaestro => equMaestro.$key == partidoPorTorneo["EquipoVisitante"]).Nombre,
                      GolesAFavor: golesVisitantes,
                      GolesEnContra: golesLocales,
                      Puntos: (golesLocales > golesVisitantes) ? 0 : (golesLocales < golesVisitantes) ? 3 : 1,
                      PartidosJugados: 1
                    }
                    clasificacion.Equipos.push(equipo);
                  }
                  else {
                    equipoVisitante.GolesAFavor += golesVisitantes;
                    equipoVisitante.GolesEnContra += golesLocales;
                    equipoVisitante.Puntos += (golesLocales > golesVisitantes) ? 0 : (golesLocales < golesVisitantes) ? 3 : 1;
                    equipoVisitante.PartidosJugados += 1;
                  }
                }
              })

            });
            //Una vez tenemos todos los datos del torneo, ordenamos los equipos según sus puntos.
            clasificacion.Equipos.sort(function(obj1, obj2) {
              console.log('clasificacion.Equipos');
              return obj1.Puntos - obj2.Puntos;
            });
            
            clasificaciones.push(clasificacion);
          });
          resolve(clasificaciones);
        })
      })
    })

  }
  getGolesJugadores(equipoKey: string) {
    return new Promise((resolve, reject) => {
      let goles: Array<any> = [];
      let jornadas: Array<any> = [];
      let jugadores: Array<any> = [];


      let equiposMaestro: Equipo[];
      //Lo primero que hacemos es obtener todos los equipos para tener sus nombres
      this.db.list('/equipos').subscribe(equipos => {
        equiposMaestro = equipos;
        let query = this.db.list('/torneos', {
          query: {
            orderByKey: true,
          }
        });
        //serán todos los torneos donde participa el equipo
        let torneosEquipo: any[] = [];
        query.subscribe(torneos => {
          //Cogemos todos los torneos donde participa el equipo
          torneos.forEach(torneo => {
            if (torneo["Equipos"] != null)
              <any[]>torneo["Equipos"].forEach(equipo => {
                if (equipo.Key == equipoKey) {
                  torneosEquipo.push(torneo)
                  return;
                }
              })
          })

          let clasificaciones: Clasificacion[] = [];
          torneosEquipo.forEach(torneoEquipo => {
            let clasificacion: Clasificacion = {
              TorneoNombre: torneoEquipo["Nombre"],
              TorneoKey: torneoEquipo["$key"],
              Temporada:torneoEquipo["Temporada"],
              Equipos: []
            };
            //Por cada torneo cogemos todos los partidos
            query = this.db.list('/partidos', {
              query: {
                orderByChild: 'Torneo',
                equalTo: torneoEquipo['$key']
              }
            });
            query.subscribe(partidosPorTorneo => {
              //Nos recorremos los partidos del torneo
              partidosPorTorneo.forEach(partidoPorTorneo => {
                //Verificamos que el partido haya acabado y tenga un resultado
                if (partidoPorTorneo["Resultado"] != null) {
                  
                  //Si el partido tiene un resultado tiene que tener dos arrays: JugadoresLocal y JugadoresVisitante
                  //Si no es así se ha insertado mal
                  let i:number=1;
                  if (partidoPorTorneo["EquipoLocal"]==equipoKey){
                    partidoPorTorneo["Resultado"]["JugadoresLocal"].forEach(jugadorLocal => {
                      
                      goles.push(jugadorLocal["GolesMarcados"]);
                      jornadas.push(i);
                      i++;
                    });
                  }
                  else{
                    partidoPorTorneo["Resultado"]["JugadoresVisitante"].forEach(jugadorLocal => {
                      goles.push(jugadorLocal["GolesMarcados"]);
                      jornadas.push(i);
                      i++;
                    });
                  }
                }
              })
            });

          });
          resolve({goles:goles,jornadas: jornadas});
        })
      })
    })

  }
  getRegistros() {
    this.registros = this.db.list('/partidos') as FirebaseListObservable<any[]>;
    return this.registros;
  }
  getRegistrosSinMapear() {
    return this.db.list('/partidos') as FirebaseListObservable<any[]>;
  }

  borrarRegistro(key$: string) {
    return new Promise((resolve, reject) => {
      if (this.registros == null)
        this.registros = this.getRegistros();
      this.registros.remove(key$).then(() => {
        console.log('success')
        resolve();
      }).catch((reason => {
        console.log('error')
        reject(reason);
      })
        );
    });
  }

  buscarRegistros(termino: string): Partido[] {
    let registrosArr: Partido[] = [];
    return registrosArr;
  }

}
