import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyEdgeToken } from "@/lib/edge-jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Rutas protegidas por rol
    const clientRoutes = ["/cliente"];
    const vetRoutes = ["/veterinario"];
    const adminRoutes = ["/administrador"];

    const isClientRoute = clientRoutes.some((route) => pathname.startsWith(route));
    const isVetRoute = vetRoutes.some((route) => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

    if (isClientRoute || isVetRoute || isAdminRoute) {
        // Verificar token desde cookie (mejor práctica) o header (si es API)
        // Aquí asumimos cookie 'token' para la navegación del dashboard
        const token = req.cookies.get("token")?.value;

        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        const payload = await verifyEdgeToken(token, process.env.JWT_SECRET || "secret");

        if (!payload) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        const role = payload.role;

        if (isClientRoute && role !== "cliente") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (isVetRoute && role !== "veterinario") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (isAdminRoute && role !== "administrador") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/cliente/:path*",
        "/veterinario/:path*",
        "/administrador/:path*",
    ],
};
