// State Management
let currentPhase = 0;
let soundEnabled = true;
let currentQuestion = 0;
let userAnswers = [];
let quizStarted = false;

// Audio Context for Sound Effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Sound Effects
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

// Scroll Progress
function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    document.querySelector('.progress-fill').style.width = `${progress}%`;
}

// Phase Detection
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

// Intersection Observer for Phase Animations
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

// Initialize Observers
document.querySelectorAll('.phase-section').forEach(section => {
    observer.observe(section);
});

// Scroll Event
window.addEventListener('scroll', () => {
    updateProgress();
    detectCurrentPhase();
});

// Navigation Functions
function scrollToPhases() {
    playClickSound();
    document.querySelector('#phases').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sound Toggle
document.getElementById('sound-toggle').addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    this.classList.toggle('muted');
    playClickSound();
});

// Quiz Data
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

// Quiz Functions
function startQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizStarted = true;
    document.getElementById('quiz-results').classList.add('hidden');
    displayQuestion();
}

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
    
    // Update navigation
    document.getElementById('question-indicator').textContent = 
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    
    // Enable next button only if answer is selected
    document.getElementById('next-btn').disabled = userAnswers[currentQuestion] === undefined;
    
    if (currentQuestion === quizQuestions.length - 1) {
        document.getElementById('next-btn').textContent = 'Submit';
    } else {
        document.getElementById('next-btn').textContent = 'Next';
    }
    
    // Restore previous answer if exists
    if (userAnswers[currentQuestion] !== undefined) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons[userAnswers[currentQuestion]].classList.add('selected');
    }
}

function selectAnswer(index) {
    playClickSound();
    userAnswers[currentQuestion] = index;
    
    // Update UI
    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.classList.remove('selected');
        if (i === index) {
            btn.classList.add('selected');
        }
    });
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    playClickSound();
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        // Submit quiz
        showResults();
    }
}

function previousQuestion() {
    playClickSound();
    
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function showResults() {
    // Calculate score
    let score = 0;
    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            score++;
        }
    });
    
    // Play sound
    if (score >= quizQuestions.length * 0.7) {
        playSuccessSound();
    } else {
        playErrorSound();
    }
    
    // Update UI
    document.getElementById('quiz-content').style.display = 'none';
    document.querySelector('.quiz-navigation').style.display = 'none';
    
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.classList.remove('hidden');
    
    document.getElementById('score-value').textContent = score;
    
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

function restartQuiz() {
    playClickSound();
    document.getElementById('quiz-content').style.display = 'block';
    document.querySelector('.quiz-navigation').style.display = 'flex';
    startQuiz();
}

// Popup Functions
const popupContent = {
    interphase: {
        title: "Interphase: Getting Ready",
        content: `
            <p>Before meiosis starts, the cell needs to get ready. Here's what happens:</p>
            
            <p><strong>DNA Copying:</strong> The cell makes a copy of all its DNA. Each chromosome gets a twin copy called a sister chromatid. They stick together at the center (the centromere). This means each new cell will get complete instructions!</p>
            
            <p><strong>Growing Bigger:</strong> The cell gets larger and makes proteins it will need. It builds all the machinery to move chromosomes around and split the cell.</p>
            
            <p><strong>Making Energy:</strong> The cell stores up energy (ATP) because meiosis takes a LOT of work!</p>
            
            <p>💡 <strong>Cool Fact:</strong> DNA copying is super accurate! It makes less than one mistake per BILLION letters copied!</p>
        `
    },
    prophase1: {
        title: "Prophase I: The DNA Trading Phase",
        content: `
            <p>Prophase I is the longest phase of meiosis. This is where your unique genetic mix is created!</p>
            
            <p><strong>Pairing Up:</strong> Matching chromosomes (one from mom, one from dad) line up next to each other really close. This is called synapsis. They need to be super close for the next step to work.</p>
            
            <p><strong>Crossing Over (The Cool Part!):</strong> While paired up, the chromosomes swap pieces of DNA! It's like trading parts of a recipe. This mixes mom's and dad's genes together in new ways. That's why you're unique!</p>
            
            <p><strong>Getting Visible:</strong> Chromosomes coil up tight so you can see them under a microscope. The nuclear bubble around them breaks down, and spindle fibers start forming.</p>
            
            <p>🧬 <strong>Did You Know?</strong> Usually 2-3 swaps happen per chromosome pair. This creates BILLIONS of possible combinations!</p>
        `
    },
    metaphase1: {
        title: "Metaphase I: The Lineup",
        content: `
            <p>During Metaphase I, the stage is set for the first major separation of chromosomes.</p>
            
            <p><strong>Chromosome Alignment:</strong> Homologous chromosome pairs (called bivalents or tetrads) line up along the metaphase plate—an imaginary line in the center of the cell.</p>
            
            <p><strong>Random Orientation:</strong> Each pair aligns randomly, with either the maternal or paternal chromosome facing each pole. This random orientation is called independent assortment and is another source of genetic variation.</p>
            
            <p><strong>Spindle Attachment:</strong> Spindle fibers from opposite poles attach to the kinetochores at each chromosome's centromere, preparing to pull them apart.</p>
            
            <p>🎲 <strong>Amazing Math:</strong> With 23 chromosome pairs in humans, independent assortment alone can produce over 8 million different combinations of chromosomes!</p>
        `
    },
    anaphase1: {
        title: "Anaphase I: The Great Separation",
        content: `
            <p>Anaphase I is where the chromosome number is actually reduced—this is why meiosis is called "reduction division."</p>
            
            <p><strong>Homolog Separation:</strong> The spindle fibers shorten, pulling homologous chromosomes apart and toward opposite poles of the cell. Importantly, sister chromatids remain attached to each other.</p>
            
            <p><strong>Independent Movement:</strong> Each homologous pair separates independently, ensuring that each pole receives a random mix of maternal and paternal chromosomes.</p>
            
            <p><strong>Chromosome Reduction:</strong> This is the critical step where the chromosome number is halved. Each pole now has a haploid number of chromosomes (though each still consists of two chromatids).</p>
            
            <p>⚠️ <strong>Important Note:</strong> Errors during this phase (like both homologs going to the same pole) can result in genetic disorders like Down syndrome.</p>
        `
    },
    telophase1: {
        title: "Telophase I: Reaching the Poles",
        content: `
            <p>Telophase I marks the end of the first meiotic division and prepares the cell for the second division.</p>
            
            <p><strong>Chromosome Arrival:</strong> The separated homologous chromosomes reach opposite poles of the cell. Each pole now has a haploid set of chromosomes, though each chromosome still consists of two sister chromatids.</p>
            
            <p><strong>Nuclear Envelope:</strong> In some organisms, nuclear envelopes reform around each set of chromosomes, creating two nuclei. In others, the cell proceeds directly to Meiosis II.</p>
            
            <p><strong>Chromosome Decondensation:</strong> Chromosomes may partially uncoil, though they typically don't return to their fully extended interphase state.</p>
            
            <p>🔄 <strong>What's Next?</strong> The cell prepares for Meiosis II, which resembles mitosis but starts with haploid cells!</p>
        `
    },
    cytokinesis1: {
        title: "Cytokinesis I: Two Cells Emerge",
        content: `
            <p>Cytokinesis is the physical division of the cell into two separate daughter cells.</p>
            
            <p><strong>Cleavage Furrow:</strong> In animal cells, a ring of contractile proteins forms around the cell's equator and contracts, pinching the cell in two. Plant cells form a cell plate instead.</p>
            
            <p><strong>Two Haploid Cells:</strong> The result is two cells, each with half the number of chromosomes as the original cell. However, each chromosome still consists of two sister chromatids joined at the centromere.</p>
            
            <p><strong>Preparation for Round Two:</strong> These cells immediately (or after a brief interphase without DNA replication) enter Meiosis II to separate the sister chromatids.</p>
            
            <p>🎯 <strong>Key Point:</strong> After Meiosis I, cells are haploid but chromosomes are still duplicated!</p>
        `
    },
    prophase2: {
        title: "Prophase II: Starting the Second Round",
        content: `
            <p>Prophase II initiates the second meiotic division in each of the two cells produced by Meiosis I.</p>
            
            <p><strong>New Spindles:</strong> A new spindle apparatus forms in each cell, perpendicular to the original spindle from Meiosis I.</p>
            
            <p><strong>Chromosome Condensation:</strong> Chromosomes condense again if they had decondensed. Remember, each chromosome still consists of two sister chromatids.</p>
            
            <p><strong>No DNA Replication:</strong> Crucially, there is no S phase before Meiosis II. The DNA that was replicated before Meiosis I will now be separated.</p>
            
            <p>💡 <strong>Similarity to Mitosis:</strong> Meiosis II is very similar to mitosis, except it starts with haploid cells!</p>
        `
    },
    metaphase2: {
        title: "Metaphase II: Aligning for Final Separation",
        content: `
            <p>Metaphase II mirrors metaphase of mitosis, with chromosomes aligning at the cell's equator.</p>
            
            <p><strong>Individual Alignment:</strong> Unlike Metaphase I where pairs lined up, now individual chromosomes (each consisting of two sister chromatids) align at the metaphase plate.</p>
            
            <p><strong>Spindle Attachment:</strong> Spindle fibers from opposite poles attach to the sister chromatids at the kinetochore, preparing to pull them apart.</p>
            
            <p><strong>Tension Checkpoint:</strong> The cell checks that all chromosomes are properly attached to spindle fibers before proceeding. This quality control prevents errors in chromosome distribution.</p>
            
            <p>✅ <strong>Quality Control:</strong> The spindle checkpoint ensures accurate chromosome segregation!</p>
        `
    },
    anaphase2: {
        title: "Anaphase II: Sister Chromatids Part Ways",
        content: `
            <p>In Anaphase II, sister chromatids finally separate, creating individual chromosomes.</p>
            
            <p><strong>Chromatid Separation:</strong> The proteins holding sister chromatids together at the centromere are broken down, allowing them to separate and move to opposite poles.</p>
            
            <p><strong>Individual Chromosomes:</strong> Once separated, each chromatid is considered an individual chromosome. Each pole receives one copy of each chromosome.</p>
            
            <p><strong>Equal Distribution:</strong> This ensures that each of the four final gametes will receive a complete haploid set of chromosomes.</p>
            
            <p>🎉 <strong>Almost Done:</strong> This is the final separation event in meiosis!</p>
        `
    },
    telophase2: {
        title: "Telophase II & Cytokinesis II: Four Unique Cells!",
        content: `
            <p>The grand finale of meiosis produces four unique haploid cells!</p>
            
            <p><strong>Nuclear Reformation:</strong> Nuclear envelopes reform around each set of chromosomes at the four poles, creating four nuclei.</p>
            
            <p><strong>Chromosome Decondensation:</strong> Chromosomes begin to uncoil and return to their extended interphase state, allowing genes to be expressed.</p>
            
            <p><strong>Final Division:</strong> Cytokinesis divides each cell again, resulting in four haploid gametes.</p>
            
            <p><strong>Genetic Uniqueness:</strong> Due to crossing over and independent assortment, each of these four cells is genetically unique—no two are alike!</p>
            
            <p>🌟 <strong>The Result:</strong> Four gametes (sperm or egg cells) ready for fertilization, each with unique genetic combinations that contribute to the diversity of life!</p>
            
            <p>🧬 <strong>Impact:</strong> This genetic diversity is the foundation of evolution and makes each organism unique!</p>
        `
    },
    interkinesis: {
        title: "Interkinesis: Quick Break Time!",
        content: `
            <p>Interkinesis is the short rest between Meiosis I and Meiosis II. Pay attention to what does NOT happen here!</p>
            
            <p><strong>NO DNA Copying:</strong> This is super important! Unlike before Meiosis I, the DNA does NOT make copies during this break. If it did, we'd end up with the wrong number of chromosomes in sperm/eggs!</p>
            
            <p><strong>What Actually Happens:</strong> The cells just rest. Some organisms skip this completely and go straight to round 2. Others might reform the nuclear bubble temporarily, but chromosomes stay condensed.</p>
            
            <p><strong>Chromosome Status:</strong> Each cell has half the chromosomes now (haploid), but each chromosome is still doubled (twin copies stuck together). That's why we need Meiosis II—to split those twins apart!</p>
            
            <p><strong>Getting Ready:</strong> The cell might make some proteins for round 2, but mainly it just keeps things the way they are.</p>
            
            <p>⚠️ <strong>Remember:</strong> NO DNA copying here! That's the big difference from the first break!</p>
        `
    }
};

function showPopup(phase) {
    playClickSound();
    const popup = document.getElementById('info-popup');
    const content = popupContent[phase];
    
    document.getElementById('popup-body').innerHTML = `
        <h3>${content.title}</h3>
        ${content.content}
    `;
    
    popup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    playClickSound();
    document.getElementById('info-popup').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Close popup on outside click
document.getElementById('info-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Initialize Quiz on load
window.addEventListener('load', () => {
    startQuiz();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('info-popup').classList.contains('hidden')) {
        closePopup();
    }
});

console.log('🧬 Meiosis Explorer Loaded! Enjoy your journey through cellular division!');

