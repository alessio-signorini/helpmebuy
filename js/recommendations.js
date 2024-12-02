// Recommendations handling module
import { getResourcePath, getCurrentCategory } from './config.js';
import { logAllRankings } from './debug.js';

let products = [];
let currentCategory = getCurrentCategory();
let categoryScoring = null;

// Initialize the category based on the URL path
function initializeCategory() {
    return currentCategory;
}

// Load products data
async function loadProducts() {
    if (products.length > 0) return;
    
    try {
        const response = await fetch(getResourcePath(`data/${currentCategory}/products.json`));
        const data = await response.json();
        products = data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        products = [];
    }
}

// Load category-specific scoring module
async function loadCategoryScoring() {
    if (categoryScoring) return categoryScoring;
    
    try {
        const module = await import(getResourcePath(`data/${currentCategory}/scoring.js`));
        categoryScoring = module.calculateScore;
        return categoryScoring;
    } catch (error) {
        console.error('Error loading scoring module:', error);
        // Fallback scoring function that gives all products equal scores
        return () => 50;
    }
}

// Calculate scores for all products
async function calculateScores(answers) {
    const products = await loadProducts();
    const scoringModule = await loadCategoryScoring();
    const scores = products.map(product => scoringModule(product, answers));
    
    // Log all rankings in development
    logAllRankings(products, scores);
    
    return scores;
}

// Calculate product score based on user answers
async function calculateProductScore(product, answers) {
    const scoringFunction = await loadCategoryScoring();
    return scoringFunction(product, answers);
}

// Get top 3 recommendations
async function getTopRecommendations(answers) {
    // Calculate all scores in parallel
    const productsWithScores = await Promise.all(
        products.map(async product => ({
            ...product,
            score: await calculateProductScore(product, answers)
        }))
    );
    
    // Sort by score and take top 3
    return productsWithScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

// Get Home Depot URL for a product
function getHomeDepotUrl(product) {
    if (product.url) {
        return product.url;
    }
    // Encode the model number for URL safety
    const encodedModel = encodeURIComponent(product.model);
    return `https://www.homedepot.com/s/${encodedModel}`;
}

// Check if an image exists at the given path
async function imageExists(imagePath) {
    try {
        const response = await fetch(getResourcePath(imagePath), { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Generate a consistent number from a string
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Get image source for a product
async function getProductImageSource(product) {
    const category = currentCategory;
    
    // If image is specified in the product data, use that
    if (product.image) {
        return getResourcePath(`images/products/${category}/${product.image}`);
    }

    // Check if model-specific image exists
    const modelImage = `${product.model}.jpg`;
    if (await imageExists(getResourcePath(`images/products/${category}/${modelImage}`))) {
        return getResourcePath(`images/products/${category}/${modelImage}`);
    }

    // Otherwise, pick a placeholder image based on model number hash
    const placeholderImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
    const hashIndex = hashString(product.model) % placeholderImages.length;
    return getResourcePath(`images/random/${category}/${placeholderImages[hashIndex]}`);
}

// Show recommendations in the UI
export async function showRecommendations(answers) {
    await loadProducts();
    const recommendations = await getTopRecommendations(answers);
    
    // Hide question panels, progress bar, and questions header
    document.querySelector('.content').style.display = 'none';
    document.querySelector('.progress-bar').style.display = 'none';
    document.querySelector('.questions-header').style.display = 'none';
    
    // Show results section
    const container = document.querySelector('.container');
    
    // Add header text
    const header = document.createElement('div');
    header.className = 'recommendations-header';
    header.innerHTML = `
        <h2>Your Perfect Match</h2>
        <p>Based on your preferences, here are our top recommendations, with the best match in the center.</p>
    `;
    container.insertBefore(header, document.querySelector('.results-podium'));
    
    // Show results podium
    const podium = document.querySelector('.results-podium');
    podium.classList.remove('hidden');
    
    // Get image sources for all recommendations
    const [second, first, third] = recommendations;
    const [secondImg, firstImg, thirdImg] = await Promise.all([
        getProductImageSource(second),
        getProductImageSource(first),
        getProductImageSource(third)
    ]);
    
    podium.innerHTML = `
        <div class="runner-up left">
            <img src="${secondImg}" alt="${second.brand} ${second.name}">
            <div class="product-info">
                <h3>${second.brand}</h3>
                <p class="product-name">${second.name}</p>
                <p class="model-number">Model: ${second.model}</p>
                <p class="price">$${second.price}</p>
                <ul>
                    ${second.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="${getHomeDepotUrl(second)}" target="_blank" class="view-details">View on Home Depot</a>
            </div>
        </div>
        
        <div class="winner">
            <img src="${firstImg}" alt="${first.brand} ${first.name}">
            <div class="product-info">
                <h3>${first.brand}</h3>
                <p class="product-name">${first.name}</p>
                <p class="model-number">Model: ${first.model}</p>
                <p class="price">$${first.price}</p>
                <ul>
                    ${first.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="${getHomeDepotUrl(first)}" target="_blank" class="buy-now">Buy Now at Home Depot</a>
            </div>
        </div>
        
        <div class="runner-up right">
            <img src="${thirdImg}" alt="${third.brand} ${third.name}">
            <div class="product-info">
                <h3>${third.brand}</h3>
                <p class="product-name">${third.name}</p>
                <p class="model-number">Model: ${third.model}</p>
                <p class="price">$${third.price}</p>
                <ul>
                    ${third.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="${getHomeDepotUrl(third)}" target="_blank" class="view-details">View on Home Depot</a>
            </div>
        </div>
    `;
}
