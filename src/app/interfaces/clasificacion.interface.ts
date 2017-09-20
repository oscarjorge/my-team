export interface Clasificacion{
    TorneoKey:string;
    TorneoNombre:string;
    Temporada:string;
    Equipos: EquipoClasificacion[]
  }
  export interface EquipoClasificacion{
    EquipoKey:string;
    EquipoNombre:string;
    Puntos:number;
    GolesAFavor:number;
    GolesEnContra: number;
    PartidosJugados: number;
  }