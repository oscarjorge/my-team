import { Sede } from '../interfaces/sede.interface';
export interface Campo{
    Nombre:string;
    Sede?: Sede;
    Direccion?: string;
    Latitud?:number;
    Longitud?:number;
    $key?:string;
  }