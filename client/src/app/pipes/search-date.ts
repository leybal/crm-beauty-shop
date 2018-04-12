import { Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'searchDate'
})

export class SearchDatePipe implements PipeTransform {
  transform(users, date) {
    if (date) {
      let day: string = date.day.toString();
      let month: string = date.month.toString();
      if (day.length === 1) day = '0' + day;
      if (month.length === 1) month = '0' + month;
      date = `${day}.${month}.${date.year}`;
      return users.filter(user => {
        return user.date.indexOf(date) > -1;
      })
    }
    return users;
  }
}
