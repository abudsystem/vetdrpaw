
export const calculateAge = (
    birthDateString: string | Date | undefined | null,
    ageFallback: number | undefined,
    t: (key: string) => string
): string => {
    if (!birthDateString) {
        if (ageFallback !== undefined && ageFallback !== null) {
            return `${ageFallback} ${ageFallback === 1 ? t('year') : t('years')}`;
        }
        return t('notAvailable');
    }

    const birthDate = new Date(birthDateString);
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    // Adjust months and years if days or months are negative
    while (days < 0) {
        months--;
        // Get days in the previous month relative to the current evaluation point
        // We look at the month *before* 'now' (or the month we are currently effectively at)
        // JS Date(year, month, 0) gives the last day of the PREVIOUS month of 'month'
        // If months decreased, we need to know how many days were in that month we just 'un-counted'
        // e.g. Jan 31 -> Mar 1. M=1. D=-30. M->0. Add days in Jan (31). D=1.
        // e.g. Jan 31 -> Feb 28. M=1. D=-3. M->0. Add days in Jan (31). D=28.
        // So we generally used the days of the month *before* the current 'now' month index (which matches the month index we just stepped into)
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() + (months - (now.getMonth() - birthDate.getMonth())), 0);

        // Actually simpler: we just need the days in the month preceding the current 'now' month pointer?
        // No, we need the days in the month index we are currently "borrowing from".
        // Just us standard "days in previous month" relative to 'now' but account for the fact we might loop?

        // Let's use the standard "borrow from previous month" logic:
        // If days < 0, we assume the end date 'now' is effectively reached by adding days to the previous month end.
        // So we add the days in the month *before* 'now'.
        const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += daysInPrevMonth;

        // If recursive loop needed (very rare unless 'now' changes, which it doesn't), we just loop.
        // But standard logic usually just does this once. The only case it fails is if daysInPrevMonth doesn't cover the negative gap?
        // e.g. Jan 30 -> Mar 1. Gap -29. PrevMonth (Feb) = 28. Result -1.
        // We need to loop again. Next prev month is Jan (31). -1 + 31 = 30.
        // Effectively: End of Jan -> Mar 1 = 30 days?
        // Jan 30 to Jan 31 (1). + Feb (28) + Mar 1 (1) = 30 days. Correct.

        // So in the loop `new Date(..., now.getMonth() + loop_offset, 0)`?
        // 'months' is effectively our offset tracker if we assume years didn't change wildly.
        // But 'months' was calculated as diff.
        // Let's rely on constructing the date.
        // Or just simply: use the month index we are currently checking.
        // If we are at 'now', prev is 'now.month - 1'.
        // If days is still < 0, we are at 'now.month - 1', prev is 'now.month - 2'.
    }

    // Correction: The loop above with specific offsets is complex.
    // Standard robust approach:
    // Reset vars and use precise steps.
    // But let's stick to the 'while days < 0' with shifting month pointer.
    // We need a variable to track which month we are looking at to get its length.
    // Initial: current month.
    // Iteration 1: borrow from month - 1.
    // Iteration 2: borrow from month - 2.

    // Re-write logic cleanly
    years = now.getFullYear() - birthDate.getFullYear();
    months = now.getMonth() - birthDate.getMonth();
    days = now.getDate() - birthDate.getDate();

    let monthPointer = now.getMonth(); // The month we are currently "in" or borrowing from

    while (days < 0) {
        months--;
        // Go back one month
        // monthPointer: 2 (Mar). We want length of Feb (1).
        // new Date(y, 2, 0) -> Last day of Feb.
        // So new Date(y, monthPointer, 0) is correct for "days in previous month".
        const daysInPrev = new Date(now.getFullYear(), monthPointer, 0).getDate();
        days += daysInPrev;
        monthPointer--; // Move pointer back
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Format output
    const parts = [];

    if (years > 0) {
        parts.push(`${years} ${years === 1 ? t('year') : t('years')}`);
    }

    if (months > 0) {
        parts.push(`${months} ${months === 1 ? t('month') : t('months')}`);
    }

    if (days > 0) {
        parts.push(`${days} ${days === 1 ? t('day') : t('days')}`);
    }

    if (parts.length === 0) {
        // If 0 years, 0 months, 0 days (today)
        return t('lessThanOneMonth') || "0 " + t('days');
    }

    return parts.join(" ");
};
