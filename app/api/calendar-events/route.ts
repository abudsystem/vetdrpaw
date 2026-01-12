import { CalendarEventController } from "@/controllers/calendar-event.controller";

export const GET = CalendarEventController.listAll;
export const POST = CalendarEventController.create;
