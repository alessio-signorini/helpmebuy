// Main application logic
import { initializeQuestions } from './questions.js';
import { showRecommendations } from './recommendations.js';
import { getResourcePath } from './config.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeQuestions();
    updateProgressDots(0);
    updateWasherImage(0);
});

// Update progress dots
export function updateProgressDots(currentQuestion) {
    const progressBar = document.querySelector('.progress-dots');
    progressBar.innerHTML = '';
    
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

// Update washer image based on question index
export function updateWasherImage(index) {
    const washerImage = document.querySelector('.washer-image');
    if (!washerImage) return;

    // Load the appropriate SVG based on the question index
    const imageNumber = Math.min(Math.floor(index / 1), 7); // Use all available sketches (0-7)
    washerImage.style.opacity = '0';
    
    setTimeout(() => {
        washerImage.style.backgroundImage = `url('${getResourcePath(`images/sketches/washer/${imageNumber}.svg`)}')`;
        washerImage.style.opacity = '1';
    }, 300);
}

// Export functions for use in other modules
export const app = {
    updateProgressDots,
    updateWasherImage
};
