import { Torneo } from '../interfaces/torneo.interface';
import { Equipo } from '../interfaces/equipo.interface';
import { Campo } from '../interfaces/campo.interface';
export interface Partido{
    EquipoLocal?:Equipo;
    EquipoVisitante?:Equipo;
    Torneo?: Torneo;
    Fecha?: Date;
    Terminado?: Boolean;
    Aplazado?: Boolean;
    Campo?:Campo;
    Hora?:any;
    $key?:string;
  }