// types/react-big-calendar.d.ts
declare module 'react-big-calendar' {
  import { ComponentType, CSSProperties } from 'react';

  export interface Event {
    title: string;
    allDay?: boolean;
    start: Date;
    end: Date;
    [key: string]: any;
  }

  export interface EventProps<TEvent extends object = Event> {
    event: TEvent;
    title: string;
    isAllDay: boolean;
    continuesPrior: boolean;
    continuesAfter: boolean;
  }

  export interface CalendarProps<TEvent extends object = Event> {
    events: TEvent[];
    startAccessor: keyof TEvent | ((event: TEvent) => Date);
    endAccessor: keyof TEvent | ((event: TEvent) => Date);
    titleAccessor?: keyof TEvent | ((event: TEvent) => string);
    allDayAccessor?: keyof TEvent | ((event: TEvent) => boolean);
    eventPropGetter?: (
      event: TEvent,
      start: Date,
      end: Date,
      selected: boolean
    ) => {
      className?: string;
      style?: CSSProperties;
    };
    onSelectEvent?: (event: TEvent) => void;
    localizer: any;
    style?: CSSProperties;
    views?: string[] | { [view: string]: boolean };
    defaultView?: string;
    components?: {
      event?: ComponentType<EventProps<TEvent>>;
    };
  }

  export const Calendar: ComponentType<CalendarProps>;
  export const momentLocalizer: (moment: any) => any;
  export const dateFnsLocalizer: (params: {
    format: any;
    parse: any;
    startOfWeek: any;
    getDay: any;
    locales: { [key: string]: any };
  }) => any;
}
