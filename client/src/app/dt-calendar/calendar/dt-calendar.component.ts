import {Component, ContentChild, Input, OnInit} from "@angular/core";
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
import {DTCalendarDayDirective} from "../calendar-day/dt-calendar-day.directive";

@Component({
  selector: 'dt-calendar',
  templateUrl: './dt-calendar.component.html',
  styleUrls: ['./dt-calendar.component.css']
})
export class DTCalendarComponent implements OnInit {


  @ContentChild(DTCalendarDayDirective) dayTemplate: DTCalendarDayDirective;

  @Input() max: Date;
  @Input() min: Date;
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
    const weekDay = DTCalendarComponent.fixWeekday(getDay(monthStart));
    const startOfWeek = subDays(monthStart, weekDay);
    const count = DTCalendarComponent.fixCount(weekDay + getDaysInMonth(this.displayDate));
    const days = range(0, count).map(number => {
      const date = addDays(startOfWeek, number);
      const past = isPast(date);
      const today = isToday(date);
      const weekend = isWeekend(date);
      const this_month = isThisMonth(date);
      const disabled = (this.min && isBefore(date, this.min)) || (this.max && isAfter(date, this.max));
      const key = format(date, 'YYYY-MM-DD');
      return {
        context: {
          date, key, past, today, this_month, disabled, weekend
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
