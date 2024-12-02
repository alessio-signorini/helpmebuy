// Main application module
import { initializeQuestions } from './questions.js';
import { getResourcePath, getCurrentCategory } from './config.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeQuestions();
    updateProgressDots(0);
});

// Update progress dots based on current question
export function updateProgressDots(currentQuestion) {
    const progressBar = document.querySelector('.progress-dots');
    if (!progressBar) return;

    // Clear existing dots
    progressBar.innerHTML = '';
    
    // Create dots for each question (7 total)
    for (let i = 0; i < 7; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        
        if (i < currentQuestion) {
            dot.classList.add('completed');
        } else if (i === currentQuestion) {
            dot.classList.add('current');
        }
        
        progressBar.appendChild(dot);
    }
}

// Update product image based on question index
export function updateProductImage(index) {
    const productImage = document.querySelector('.product-image');
    if (!productImage) return;

    const category = getCurrentCategory();
    
    // Load the appropriate SVG based on the question index
    const imageNumber = Math.min(Math.floor(index / 1), 7);
    productImage.style.opacity = '0';
    
    setTimeout(() => {
        productImage.style.backgroundImage = `url('${getResourcePath(`images/sketches/${category}/${imageNumber}.svg`)}')`;
        productImage.style.opacity = '1';
    }, 300);
}

// Export functions for use in other modules
export const app = {
    updateProgressDots,
    updateProductImage
};
