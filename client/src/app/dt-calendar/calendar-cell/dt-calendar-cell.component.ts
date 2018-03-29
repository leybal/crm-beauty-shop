import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DTCalendarDayContextContent } from '../calendar-day/dt-calendar-day-context';

@Component({
  selector: 'dt-calendar-cell',
  templateUrl: './dt-calendar-cell.component.html',
  styleUrls: ['./dt-calendar-cell.component.css']
})
export class DTCalendarCellComponent implements OnInit {

  @Input() day: DTCalendarDayContextContent

  @Input() selected: boolean;

  @HostBinding('class.this-month') get thisMonth() {
    return this.day.this_month;
  }

  @HostBinding('class.weekend') get weekend() {
    return this.day.weekend;
  }

  @HostBinding('class.selected') get _selected() {
    return this.selected;
  }

  constructor() { }

  ngOnInit() {
  }

}
