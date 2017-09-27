import { Pipe, PipeTransform } from '@angular/core';
import { Torneo } from '../interfaces/torneo.interface'
@Pipe({
  name: 'displayTorneo',
  pure: false
})
export class DisplayTorneoPipe implements PipeTransform {
  transform(torneo: Torneo): string {
      return torneo.Nombre + ' (' + torneo.Temporada + ')'
  }
}
