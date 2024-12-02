// Recommendations handling module
let products = null;
let currentCategory = null;

// Initialize the category based on the URL path
function initializeCategory() {
    const path = window.location.pathname;
    currentCategory = path.split('/')[1] || 'washer'; // Default to 'washer' if no category
    return currentCategory;
}

// Load products data
async function loadProducts() {
    if (products === null) {
        try {
            const category = initializeCategory();
            const response = await fetch(`/data/${category}/products.json`);
            const data = await response.json();
            products = data.products; // Access the products array from the data
        } catch (error) {
            console.error('Error loading products:', error);
            products = [];
        }
    }
    return products;
}

// Calculate product score based on user answers
function calculateProductScore(product, answers) {
    let score = 0;
    
    // Price range
    const priceRanges = {
        'budget': [0, 600],
        'mid_range': [601, 900],
        'premium': [901, 1200],
        'luxury': [1201, Infinity]
    };
    const userPriceRange = priceRanges[answers[1]];
    if (product.price >= userPriceRange[0] && product.price <= userPriceRange[1]) {
        score += 3;
    }

    // Loading type preference
    if (product.attributes.type === answers[4]) {
        score += 2;
    }

    // Size preference
    if (answers[2] === 'compact' && product.attributes.size === 'compact') {
        score += 2;
    }

    // Smart features
    if (answers[7] === 'smart' && product.attributes.smart) {
        score += 2;
    } else if (answers[7] === 'basic' && !product.attributes.smart) {
        score += 2;
    }

    return score;
}

// Get top 3 recommendations
function getTopRecommendations(answers) {
    return products
        .map(product => ({
            ...product,
            score: calculateProductScore(product, answers)
        }))
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
        const response = await fetch(imagePath, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Get image source for a product
async function getProductImageSource(product) {
    const category = currentCategory;
    
    // If image is specified in the product data, use that
    if (product.image) {
        return `images/products/${category}/${product.image}`;
    }

    // Check if model-specific image exists
    const modelImage = `${product.model}.jpg`;
    if (await imageExists(`images/products/${category}/${modelImage}`)) {
        return `images/products/${category}/${modelImage}`;
    }

    // Otherwise, pick a random placeholder image
    const randomImages = ['1.jpg', '2.jpg', '3.jpg'];
    const randomIndex = Math.floor(Math.random() * randomImages.length);
    return `images/random/${category}/${randomImages[randomIndex]}`;
}

// Show recommendations in the UI
export async function showRecommendations(answers) {
    await loadProducts();
    const recommendations = getTopRecommendations(answers);
    
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
