// Questions handling module
import { updateProgressDots, updateWasherImage } from './app.js';
import { showRecommendations } from './recommendations.js';
import { BASE_URL, getResourcePath } from './config.js';

let questions = [];
let userAnswers = {};
let currentQuestionIndex = 0;
let currentCategory = null;

// Initialize the category based on the URL path
function initializeCategory() {
    const path = window.location.pathname;
    const cleanPath = path.replace(BASE_URL, '');
    currentCategory = cleanPath.split('/')[1] || 'washer'; // Default to 'washer' if no category
    return currentCategory;
}

// Fetch questions from JSON file
export async function initializeQuestions() {
    try {
        const category = initializeCategory();
        const response = await fetch(getResourcePath(`data/${category}/questions.json`));
        const data = await response.json();
        questions = data.questions;
        showQuestion(currentQuestionIndex);
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

// Display current question
export function showQuestion(questionIndex) {
    if (questionIndex >= questions.length) {
        return;
    }

    const question = questions[questionIndex];
    const container = document.querySelector('.question-container');
    
    container.innerHTML = `
        <h2>${question.text}</h2>
        <div class="options">
            ${question.options.map(option => `
                <button class="option-button" data-value="${option.value}">
                    ${option.text}
                </button>
            `).join('')}
        </div>
    `;

    // Add click handlers to options
    container.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => handleOptionClick(button.dataset.value));
    });

    updateProgressDots(questionIndex);
    updateWasherImage(questionIndex);
}

// Handle option click
function handleOptionClick(value) {
    userAnswers[questions[currentQuestionIndex].id] = value;
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        showFinalRecommendations();
    }
}

// Show final recommendations
async function showFinalRecommendations() {
    try {
        await showRecommendations(userAnswers);
    } catch (error) {
        console.error('Error showing recommendations:', error);
    }
}

// Get all user answers
export function getUserAnswers() {
    return userAnswers;
}
