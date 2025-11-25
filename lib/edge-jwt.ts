export async function verifyEdgeToken(token: string, secret: string) {
    try {
        const [header, payload, signature] = token.split(".");
        if (!header || !payload || !signature) throw new Error("Invalid token");

        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            enc.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const valid = await crypto.subtle.verify(
            "HMAC",
            key,
            base64UrlToUint8Array(signature),
            enc.encode(`${header}.${payload}`)
        );

        if (!valid) return null;

        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch (e) {
        return null;
    }
}

function base64UrlToUint8Array(base64Url: string) {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
