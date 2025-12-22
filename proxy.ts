import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyEdgeToken } from "@/lib/edge-jwt";

// 🚨 Ahora el handler debe llamarse "proxy"
export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // --- I18N LOGIC ---
    let locale = req.cookies.get("NEXT_LOCALE")?.value;
    let localeSet = !!locale;
    if (!locale) {
        const acceptLanguage = req.headers.get("accept-language");
        if (acceptLanguage) {
            locale = acceptLanguage.split(",")[0].split("-")[0];
        }
        if (!locale || !["es", "en"].includes(locale)) {
            locale = "es";
        }
    }
    // --- END I18N LOGIC ---

    let res = NextResponse.next();

    // Set locale cookie if not present
    if (!localeSet) {
        res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31536000 });
    }

    // Rutas protegidas por rol
    const clientRoutes = ["/cliente"];
    const vetRoutes = ["/veterinario"];
    const adminRoutes = ["/administrador"];

    const isClientRoute = clientRoutes.some((route) => pathname.startsWith(route));
    const isVetRoute = vetRoutes.some((route) => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

    if (isClientRoute || isVetRoute || isAdminRoute) {

        // Leer token desde cookies (Next 16 sigue soportando esto)
        const token = req.cookies.get("token")?.value;

        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        const payload = await verifyEdgeToken(
            token,
            process.env.JWT_SECRET || "secret"
        );

        if (!payload) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        const role = payload.role;

        // Validación por roles
        if (isClientRoute && role !== "cliente") {
            const resRedirect = NextResponse.redirect(new URL("/", req.url));
            return resRedirect;
        }

        if (isVetRoute && role !== "veterinario") {
            const resRedirect = NextResponse.redirect(new URL("/", req.url));
            return resRedirect;
        }

        if (isAdminRoute && role !== "administrador") {
            const resRedirect = NextResponse.redirect(new URL("/", req.url));
            return resRedirect;
        }
    }

    return res;
}

// 🔥 El config sigue igual
export const config = {
    matcher: [
        "/cliente/:path*",
        "/veterinario/:path*",
        "/administrador/:path*",
    ],
};
