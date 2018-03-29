import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DTCalendarComponent } from './calendar/dt-calendar.component';
import { DTCalendarDayDirective } from './calendar-day/dt-calendar-day.directive';
import { DTCalendarCellComponent } from './calendar-cell/dt-calendar-cell.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DTCalendarComponent,
    DTCalendarDayDirective,
    DTCalendarCellComponent
  ],
  exports:[
    DTCalendarComponent,
    DTCalendarDayDirective,
    DTCalendarCellComponent
  ]
})
export class DTCalendarModule { }
