// Determine if we're running locally or in production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Set the base URL accordingly
export const BASE_URL = isLocal ? '' : '/helpmebuy';

// Helper function to get the correct path for any resource
export function getResourcePath(path) {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Remove BASE_URL if it's already in the path to avoid duplication
    const pathWithoutBase = cleanPath.startsWith('helpmebuy/') ? cleanPath.slice(9) : cleanPath;
    return `${BASE_URL}/${pathWithoutBase}`;
}

// Get the current category from the URL, handling the base URL correctly
export function getCurrentCategory() {
    const path = window.location.pathname;
    const pathWithoutBase = path.replace(BASE_URL, '');
    return pathWithoutBase.split('/')[1] || 'washer';
}

// Format category name for display (e.g., "washer" -> "Washer")
export function formatCategoryName(category = getCurrentCategory()) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Get full product name (e.g., "washer" -> "Washing Machine")
export function getFullProductName(category = getCurrentCategory()) {
    const productNames = {
        'washer': 'Washing Machine',
        'dryer': 'Clothes Dryer',
        // Add more mappings as needed
    };
    return productNames[category] || formatCategoryName(category);
}
