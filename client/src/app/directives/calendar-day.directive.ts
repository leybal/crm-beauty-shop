import {Directive, TemplateRef} from '@angular/core';

interface CalendarDayContext {
  context: {
    date: Date;
    past: boolean;
    today: boolean;
    this_month: boolean;
    disabled: boolean;
    weekend: boolean;
    key: string;
  };
}

@Directive({
  selector: '[calendarDay]'
})
export class CalendarDayDirective {

  constructor(public template: TemplateRef<CalendarDayContext>) {
  }

}
