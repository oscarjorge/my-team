import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term: any): any {
      return items.filter(item => item[term.key].indexOf(term.value) !== -1);
  }
}
