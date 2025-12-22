import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
    // Try to get locale from segment, then cookie, then header
    let locale = await requestLocale;

    if (!locale) {
        const cookieStore = await cookies();
        locale = cookieStore.get('NEXT_LOCALE')?.value;
    }

    if (!locale) {
        const headersList = await headers();
        const acceptLanguage = headersList.get('accept-language');
        if (acceptLanguage) {
            locale = acceptLanguage.split(',')[0].split('-')[0];
        }
    }

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
