import { CalendarEventController } from "@/controllers/calendar-event.controller";

export const GET = CalendarEventController.getOne;
export const PUT = CalendarEventController.update;
export const DELETE = CalendarEventController.delete;
