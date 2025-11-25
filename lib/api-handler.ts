import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

type HandlerFunction = (req: Request, ...args: any[]) => Promise<NextResponse>;

export const apiHandler = (handler: HandlerFunction) => {
    return async (req: Request, ...args: any[]) => {
        try {
            return await handler(req, ...args);
        } catch (err: any) {
            console.error("API Error:", err);

            if (err instanceof ZodError) {
                return NextResponse.json(
                    { message: "Validation Error", errors: (err as ZodError) },
                    { status: 400 }
                );
            }

            if (err instanceof AppError) {
                return NextResponse.json(
                    { message: err.message },
                    { status: err.statusCode }
                );
            }

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    };
};
