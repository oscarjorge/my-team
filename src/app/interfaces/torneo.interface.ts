import { Division } from '../interfaces/division.interface';
import { Sede } from '../interfaces/sede.interface';
import { Grupo } from '../interfaces/grupo.interface';
import { Equipo } from '../interfaces/equipo.interface';
export interface Torneo{
    Nombre:string;
    Sede?: Sede;
    Grupo?: Grupo;
    Division?: Division;
    Temporada: string;
    Equipos?: Equipo[];
    $key?:string;
  }
  export interface TorneoDisplay{
  
    $key:string,
    Sede:string,
    Grupo:string,
    Division:string,
    Nombre: string,
    Temporada:string
  }
  export interface TorneoFiltro{
      Sede?:string,
      Grupo?:string,
      Division?:string,
      Temporada?:string,
      Torneo?:string
    }