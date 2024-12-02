// Scoring logic specific to washers
let debugModule = { logScoringDetails: () => {} };

// Initialize debug module
async function initializeDebug() {
    try {
        debugModule = await import('../../js/debug.js');
    } catch (e) {
        // Debug module not available in production
        debugModule = { logScoringDetails: () => {} };
    }
}

export async function calculateScore(product, answers) {
    await initializeDebug();
    let score = 0;
    
    // Price range (0-3 points)
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

    // Size preference (0-2 points)
    if (answers[2] === 'compact' && product.attributes.size === 'compact') {
        score += 2;
    } else if (answers[2] === 'standard' && product.attributes.size !== 'compact') {
        score += 1;
    }

    // Capacity based on usage (0-2 points)
    if (answers[3] === 'large' && product.attributes.size === 'large') {
        score += 2;
    } else if (answers[3] === 'small' && product.attributes.size === 'compact') {
        score += 2;
    }

    // Loading type preference (0-3 points)
    if (answers[4] === product.attributes.type) {
        score += 3;
    }

    // Main priority (0-2 points)
    if (answers[5] === 'efficiency' && product.attributes.efficiency === 'high') {
        score += 2;
    } else if (answers[5] === 'speed' && product.features.some(f => f.toLowerCase().includes('speed'))) {
        score += 2;
    } else if (answers[5] === 'simplicity' && !product.attributes.smart) {
        score += 2;
    }

    // Clothes type (0-2 points)
    if (answers[6] === 'delicates' && product.features.some(f => 
        f.toLowerCase().includes('delicate') || f.toLowerCase().includes('gentle'))) {
        score += 2;
    } else if (answers[6] === 'heavy_duty' && product.features.some(f => 
        f.toLowerCase().includes('heavy') || f.toLowerCase().includes('deep clean'))) {
        score += 2;
    } else if (answers[6] === 'mixed') {
        // For mixed loads, prefer machines with more features
        score += (product.features.length >= 4) ? 2 : 1;
    }

    // Smart features (0-2 points)
    if (answers[7] === 'smart' && product.attributes.smart) {
        score += 2;
    } else if (answers[7] === 'basic' && !product.attributes.smart) {
        score += 2;
    }

    // Log detailed scoring info in development
    debugModule.logScoringDetails(product, answers, score);

    return score;
}
