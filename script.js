/**
 * MEIOSIS EXPLORER - Interactive 3D Educational Application
 * Main JavaScript file handling UI interactions, animations, and quiz functionality
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let currentPhase = 0;
let soundEnabled = true;
let currentQuestion = 0;
let userAnswers = [];
let quizStarted = false;

// ============================================================================
// AUDIO SYSTEM
// ============================================================================

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Plays a sound effect with specified parameters
 * @param {number} frequency - Sound frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {string} type - Oscillator type (sine, square, sawtooth, triangle)
 */
function playSound(frequency, duration, type = 'sine') {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playClickSound() {
    playSound(800, 0.1, 'square');
}

function playSuccessSound() {
    playSound(523.25, 0.15, 'sine');
    setTimeout(() => playSound(659.25, 0.15, 'sine'), 100);
    setTimeout(() => playSound(783.99, 0.2, 'sine'), 200);
}

function playErrorSound() {
    playSound(200, 0.3, 'sawtooth');
}

// ============================================================================
// SCROLL PROGRESS & PHASE TRACKING
// ============================================================================

/**
 * Updates the progress bar based on scroll position
 */
function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    document.querySelector('.progress-fill').style.width = `${progress}%`;
}

/**
 * Detects which phase section is currently in view
 */
function detectCurrentPhase() {
    const sections = document.querySelectorAll('.phase-section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentPhase = index + 1;
            document.getElementById('current-phase').textContent = currentPhase;
        }
    });
}

// ============================================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize observers for all phase sections
document.querySelectorAll('.phase-section').forEach(section => {
    observer.observe(section);
});

// ============================================================================
// SCROLL EVENT HANDLER
// ============================================================================

window.addEventListener('scroll', () => {
    updateProgress();
    detectCurrentPhase();
});

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

function scrollToPhases() {
    playClickSound();
    document.querySelector('#phases').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// SOUND TOGGLE
// ============================================================================

document.getElementById('sound-toggle').addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    this.classList.toggle('muted');
    playClickSound();
});

// ============================================================================
// MOBILE MENU FUNCTIONALITY
// ============================================================================

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');
const menuIcon = document.getElementById('menu-icon');

if (mobileMenuToggle) {
    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuIcon.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        playClickSound();
    });

    // Close menu when clicking a navigation link
    const navLinksElements = navLinks.querySelectorAll('a');
    navLinksElements.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.textContent = '☰';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) && 
            navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuIcon.textContent = '☰';
        }
    });
}

// ============================================================================
// QUIZ DATA
// ============================================================================

const quizQuestions = [
    {
        question: "What is the main purpose of meiosis?",
        options: [
            "To create identical cells for growth",
            "To make sperm and egg cells with half the chromosomes",
            "To repair damaged DNA",
            "To increase cell size"
        ],
        correct: 1
    },
    {
        question: "During which phase does crossing over (DNA swapping) occur?",
        options: [
            "Metaphase I",
            "Anaphase II",
            "Prophase I",
            "Telophase I"
        ],
        correct: 2
    },
    {
        question: "How many cells result from meiosis?",
        options: [
            "Two identical cells",
            "Four identical cells",
            "Four unique cells",
            "Two unique cells"
        ],
        correct: 2
    },
    {
        question: "What happens during Anaphase I?",
        options: [
            "Sister chromatids (twin copies) separate",
            "Homologous chromosomes (matching pairs) separate",
            "DNA copies itself",
            "Nuclear membrane reforms"
        ],
        correct: 1
    },
    {
        question: "Why is crossing over important?",
        options: [
            "It repairs mutations",
            "It increases genetic variation (makes you unique!)",
            "It speeds up cell division",
            "It prevents errors"
        ],
        correct: 1
    },
    {
        question: "What is the difference between Meiosis I and Meiosis II?",
        options: [
            "Meiosis I is faster than Meiosis II",
            "Meiosis I separates pairs; Meiosis II separates twin copies",
            "Meiosis I creates 4 cells; Meiosis II creates 2 cells",
            "There is no difference"
        ],
        correct: 1
    },
    {
        question: "Where does meiosis happen in the body?",
        options: [
            "In all body cells",
            "Only in sex organs (testes and ovaries)",
            "Only in the brain",
            "Only in muscles"
        ],
        correct: 1
    },
    {
        question: "What happens during interkinesis (the break between round 1 and round 2)?",
        options: [
            "DNA copies itself again",
            "The cell just rests - NO DNA copying!",
            "Chromosomes disappear",
            "The cell grows bigger"
        ],
        correct: 1
    },
    {
        question: "How does independent assortment create variety?",
        options: [
            "It speeds up DNA copying",
            "It makes cells divide faster",
            "It randomly mixes mom and dad chromosomes",
            "It repairs damaged DNA"
        ],
        correct: 2
    },
    {
        question: "What's the difference between mitosis and meiosis results?",
        options: [
            "Mitosis makes 4 cells; meiosis makes 2 cells",
            "Mitosis makes 2 identical cells; meiosis makes 4 unique cells",
            "Mitosis is faster than meiosis",
            "They produce the same results"
        ],
        correct: 1
    },
    {
        question: "Why do we need TWO divisions in meiosis?",
        options: [
            "To make the process slower",
            "First splits pairs, second splits twin copies",
            "To make more cells",
            "To copy DNA twice"
        ],
        correct: 1
    }
];

// ============================================================================
// QUIZ FUNCTIONALITY
// ============================================================================

/**
 * Initializes the quiz from the beginning
 */
function startQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizStarted = true;
    document.getElementById('quiz-results').classList.add('hidden');
    displayQuestion();
}

/**
 * Displays the current question and its options
 */
function displayQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const question = quizQuestions[currentQuestion];
    
    const html = `
        <div class="question-container">
            <h3 class="question-text">${currentQuestion + 1}. ${question.question}</h3>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <button class="option-btn" onclick="selectAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    quizContent.innerHTML = html;
    
    // Update navigation controls
    document.getElementById('question-indicator').textContent = 
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').disabled = userAnswers[currentQuestion] === undefined;
    
    // Update button text for last question
    if (currentQuestion === quizQuestions.length - 1) {
        document.getElementById('next-btn').textContent = 'Submit';
    } else {
        document.getElementById('next-btn').textContent = 'Next';
    }
    
    // Restore previous answer if it exists
    if (userAnswers[currentQuestion] !== undefined) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons[userAnswers[currentQuestion]].classList.add('selected');
    }
}

/**
 * Handles answer selection for current question
 * @param {number} index - Index of the selected option
 */
function selectAnswer(index) {
    playClickSound();
    userAnswers[currentQuestion] = index;
    
    // Update UI to show selection
    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.classList.remove('selected');
        if (i === index) {
            btn.classList.add('selected');
        }
    });
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

/**
 * Advances to the next question or submits quiz if on last question
 */
function nextQuestion() {
    playClickSound();
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        showResults();
    }
}

/**
 * Goes back to the previous question
 */
function previousQuestion() {
    playClickSound();
    
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

/**
 * Calculates score and displays quiz results
 */
function showResults() {
    let score = 0;
    
    // Calculate the score
    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            score++;
        }
    });
    
    // Play appropriate sound
    if (score >= quizQuestions.length * 0.7) {
        playSuccessSound();
    } else {
        playErrorSound();
    }
    
    // Hide quiz content and show results
    document.getElementById('quiz-content').style.display = 'none';
    document.querySelector('.quiz-navigation').style.display = 'none';
    
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.classList.remove('hidden');
    
    document.getElementById('score-value').textContent = score;
    
    // Generate personalized message based on score
    let message = '';
    const percentage = (score / quizQuestions.length) * 100;
    
    if (percentage === 100) {
        message = "Perfect score! You're a meiosis master! 🏆";
    } else if (percentage >= 75) {
        message = "Awesome! You really know your meiosis! 🌟";
    } else if (percentage >= 50) {
        message = "Good job! Review the phases to get even better. 📚";
    } else {
        message = "Keep learning! Go through the phases again. You got this! 💪";
    }
    
    document.getElementById('results-message').textContent = message;
}

/**
 * Resets and restarts the quiz
 */
function restartQuiz() {
    playClickSound();
    document.getElementById('quiz-content').style.display = 'block';
    document.querySelector('.quiz-navigation').style.display = 'flex';
    startQuiz();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Start quiz when page loads
window.addEventListener('load', () => {
    startQuiz();
});

// ============================================================================
// CONSOLE MESSAGE
// ============================================================================

console.log('🧬 Meiosis Explorer Loaded! Enjoy your journey through cellular division!');
