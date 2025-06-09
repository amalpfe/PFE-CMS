declare module 'react-big-calendar' {
  import { ComponentType } from 'react';

  export interface Event {
    title: string;
    allDay?: boolean;
    start: Date;
    end: Date;
    [key: string]: any;
  }
    interface CalendarProps<Event = object> {
    min?: Date;
    max?: Date;
  }

  export interface CalendarProps<TEvent extends object = Event> {
    events: TEvent[];
    startAccessor: keyof TEvent | ((event: TEvent) => Date);
    endAccessor: keyof TEvent | ((event: TEvent) => Date);
    titleAccessor?: keyof TEvent | ((event: TEvent) => string);
    allDayAccessor?: keyof TEvent | ((event: TEvent) => boolean);
    eventPropGetter?: (event: TEvent, start: Date, end: Date, selected: boolean) => {
      className?: string;
      style?: React.CSSProperties;
    };
    onSelectEvent?: (event: TEvent) => void;
    views?: string[] | { [view: string]: boolean };
    defaultView?: string;
    localizer: any;
    style?: React.CSSProperties;
  }

  export const Calendar: ComponentType<CalendarProps>;
  export const dateFnsLocalizer: (params: {
    format: any;
    parse: any;
    startOfWeek: any;
    getDay: any;
    locales: { [key: string]: any };
  }) => any;
}
