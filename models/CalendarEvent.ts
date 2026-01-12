import mongoose, { Schema, Document } from "mongoose";

export interface ICalendarEvent extends Document {
    title: string | { es: string; en: string };
    date: string;
    description: string | { es: string; en: string };
    location?: string | { es: string; en: string };
    createdAt: Date;
    updatedAt: Date;
}

const CalendarEventSchema: Schema = new Schema(
    {
        title: { type: Schema.Types.Mixed, required: true },
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        description: { type: Schema.Types.Mixed, required: true },
        location: { type: Schema.Types.Mixed },
    },
    {
        timestamps: true,
    }
);

// Prevent Mongoose overwrite warning in development
if (process.env.NODE_ENV !== 'production') delete mongoose.models.CalendarEvent;

export const CalendarEvent = mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>("CalendarEvent", CalendarEventSchema);
