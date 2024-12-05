export default function getCookieValue(name: string): string | null {
    const cookieString = document.cookie;
    if (!cookieString) return null;

    const cookies = cookieString.split('; ');
    const targetCookie = cookies.find(cookie => {
        const [key] = cookie.split('=');
        return decodeURIComponent(key) === name;
    });

    if (!targetCookie) return null;

    const [, value] = targetCookie.split('=');
    return value ? decodeURIComponent(value) : null;
}
