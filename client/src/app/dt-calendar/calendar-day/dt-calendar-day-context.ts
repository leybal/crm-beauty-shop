export interface DTCalendarDayContext {
  context: DTCalendarDayContextContent
}

export interface DTCalendarDayContextContent {
  date: Date;
  past: boolean;
  today: boolean;
  this_month: boolean;
  disabled: boolean;
  weekend: boolean;
  key: string;
}
