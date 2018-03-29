import {Directive, OnInit, TemplateRef} from '@angular/core';
//import {DTCalendarDayContext} from './dt-calendar-day-context';
import {DTCalendarDayContext} from './dt-calendar-day-context';


@Directive({
  selector: '[dtCalendarDay]'
})
export class DTCalendarDayDirective implements OnInit {

  ngOnInit(): void {
  }

  constructor(public template: TemplateRef<DTCalendarDayContext>) {
  }

}
