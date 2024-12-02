// Main application logic
import { initializeQuestions } from './questions.js';
import { showRecommendations } from './recommendations.js';

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

// Update washer image based on current question
export function updateWasherImage(questionNumber) {
    const washerImage = document.querySelector('.washer-image');
    washerImage.style.opacity = '0';
    
    setTimeout(() => {
        washerImage.style.backgroundImage = `url(images/sketches/washer-${questionNumber}.svg)`;
        washerImage.style.opacity = '1';
    }, 300);
}

// Export functions for use in other modules
export const app = {
    updateProgressDots,
    updateWasherImage
};
