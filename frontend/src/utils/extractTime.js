export function extractTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const timeString = `${hours}:${minutes}`;

    if (isToday) return timeString;
    if (isYesterday) return `Yesterday ${timeString}`;

    const options = { month: "short", day: "numeric" };
    return `${date.toLocaleDateString(undefined, options)} ${timeString}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}
