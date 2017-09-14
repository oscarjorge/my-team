import { Torneo } from '../interfaces/torneo.interface';
import { Equipo } from '../interfaces/equipo.interface';
export interface Partido{
    EquipoLocal?:Equipo;
    EquipoVisitante?:Equipo;
    Torneo?: Torneo;
    Fecha?: Date;
    Terminado?: Boolean;
    Aplazado?: Boolean;
    $key?:string;
  }