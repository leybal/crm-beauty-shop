import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'FilterByRolePipe',
})
export class FilterByRolePipe implements PipeTransform {
  transform(value: any, input: string) {
    if (input) {

      if (input === 'all') {
        return value.filter(function (el: any) {
          return el.name;
        });

      } else if (input === 'customer') {
        return value.filter(function (el: any) {
          if (el.role === 'customer') {
            return el.name;
          }
        });

      } else {
        return value.filter(function (el: any) {
          if (el.role === 'master') {
            return el.name;
          }
        });

      }
    }
    return value;
  }
}
