import {Component, Input, OnInit} from "@angular/core";
import {chunk, range} from 'lodash';
import {
  addDays,
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isAfter,
  isBefore,
  isPast,
  isThisMonth,
  isToday,
  isWeekend,
  startOfMonth,
  subDays,
  subMonths
} from 'date-fns';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.css']
})
export class CalendarComponent implements OnInit {

  month: any[][];

  private _displayDate: Date;

  @Input() set displayDate(date: Date) {
    this._displayDate = date;
    this.refresh();
  }

  get displayDate(): Date {
    return this._displayDate || new Date();
  }

  // adjust weekday
  static fixWeekday(weekDay: number) {
    return weekDay === 0 ? 6 : weekDay - 1;
  }

  // adjust count to end of last week
  static fixCount(count: number) {
    const x = count % 7;
    return x !== 0 ? (count - x) + 7 : count;
  }

  refresh() {
    const monthStart = startOfMonth(this.displayDate);
    const weekDay = CalendarComponent.fixWeekday(getDay(monthStart));
    const startOfWeek = subDays(monthStart, weekDay);
    const count = CalendarComponent.fixCount(weekDay + getDaysInMonth(this.displayDate));
    const days = range(0, count).map(number => {
      const date = addDays(startOfWeek, number);
      const past = isPast(date);
      const today = isToday(date);
      const weekend = isWeekend(date);
      const this_month = isThisMonth(this.displayDate);
      const key = format(date, 'YYYY-MM-DD');
      return {
        context: {
          date, key, past, today, this_month, weekend
        }
      };
    });
    this.month = chunk(days, 7);
  }

  ngOnInit(): void {
    this.refresh();
  }

  public next() {
    this.displayDate = addMonths(this.displayDate, 1);
  }

  public previous() {
    this.displayDate = subMonths(this.displayDate, 1);
  }
}
