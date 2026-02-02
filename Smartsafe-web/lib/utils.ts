export function hasValidUrl(url: string | undefined | null): boolean {
    if (!url) return false;
    return url.trim().length > 0;
}
