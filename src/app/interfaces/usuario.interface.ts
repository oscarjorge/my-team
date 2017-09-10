export interface Usuario{
  IdUnico:string;
  Mail:string;
  Equipos?:[{Key}];
  Rol?:string;
}