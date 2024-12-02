// Determine if we're running locally or in production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Set the base URL accordingly
export const BASE_URL = isLocal ? '' : '/helpmebuy';

// Helper function to get the correct path for any resource
export function getResourcePath(path) {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
}
