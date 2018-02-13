import {Pipe, PipeTransform} from '@angular/core';
import {Repository} from '../../models/repository';

@Pipe({
  name: 'repoFilter'
})
export class RepoFilterPipe implements PipeTransform {

  transform(items: Repository[], value: string): Repository[] {
    if (!items) return [];
    return items.filter(item => {
      if (item.full_name.indexOf(value) === -1) {
        return false;
      } else {
        return true;
      }
    });
  }

}
