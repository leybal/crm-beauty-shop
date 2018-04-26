import {Pipe, PipeTransform} from "@angular/core";
import 'rxjs/add/operator/map';

@Pipe({
  name: 'searchStatus'
})

export class SearchStatusPipe implements PipeTransform {

  // transform(users, value) {
  //   console.log(typeof value)
  //   if (value) {
  //     console.log(value)
  //     value = value.toLowerCase();
  //     return users.filter(user => {
  //       return user.status.toLowerCase().indexOf(value) > -1;
  //     })
  //   }
  //   return users;
  // }

  transform(users: any, value: any): any {
    if (value && Array.isArray(users)) {
      if (value.status.length === 1) {
        return users.filter(item => item.status === '' + value.status)
      }
    }
    return users;
  }

}

