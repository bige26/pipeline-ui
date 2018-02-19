import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], str: string, prop: string): any[] {
    if (!items) return [];
    return items.filter(item => {
      if (item[prop].indexOf(str) === -1) {
        return false;
      } else {
        return true;
      }
    });
  }

}
