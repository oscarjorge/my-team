
export interface Jugador{
  Nombre:string;
  Equipos: any[];
  Imagen:string;
  Caracteristicas:string;
  Apodo:string;
  key$?:string;
}
export interface JugadorEstadisticas{
  GolesMarcados:number;
  GolesEncajados:number;
  GolesPropiaPuerta:number;
  Amarillas:number;
  Rojas:number;
  key$:string;
}
