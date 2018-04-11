import { Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'searchStatus'
})

export class SearchStatusPipe implements PipeTransform {
  transform(users, value) {
    if (value) {
      value = value.toLowerCase();
      return users.filter(user => {
        return user.status.toLowerCase().indexOf(value) > -1;
      })
    }
    return users;
  }
}
