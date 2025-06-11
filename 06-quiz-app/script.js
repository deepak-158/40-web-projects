// Quiz App - I love trivia so this was fun to build!
// Spent way too much time writing questions but it was worth it

class QuizApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questions = [];
        this.userAnswers = [];
        this.selectedCategory = 'general'; // default category
        this.selectedDifficulty = 'easy'; // start easy
        this.questionCount = 10; // good middle ground
        this.timeLimit = 30; // seconds per question
        this.timeLeft = 30;
        this.timer = null;
        this.startTime = null;
        this.endTime = null;
        
        this.initializeElements();
        this.loadQuestions(); // load the questions database
        this.bindEvents();
    }

    initializeElements() {
        // Screens
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.reviewScreen = document.getElementById('reviewScreen');

        // Welcome screen elements
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.questionCountSelect = document.getElementById('questionCount');
        this.timeLimitSelect = document.getElementById('timeLimit');
        this.startQuizBtn = document.getElementById('startQuizBtn');

        // Quiz screen elements
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.totalQuestionsSpan = document.getElementById('totalQuestions');
        this.categoryDisplay = document.getElementById('categoryDisplay');
        this.timerDisplay = document.getElementById('timer');
        this.timeLeftSpan = document.getElementById('timeLeft');
        this.currentScoreSpan = document.getElementById('currentScore');
        this.progressFill = document.getElementById('progressFill');
        this.questionText = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');
        this.skipBtn = document.getElementById('skipBtn');
        this.nextBtn = document.getElementById('nextBtn');

        // Results screen elements
        this.trophyIcon = document.getElementById('trophyIcon');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.resultsMessage = document.getElementById('resultsMessage');
        this.finalScore = document.getElementById('finalScore');
        this.finalTotal = document.getElementById('finalTotal');
        this.scorePercentage = document.getElementById('scorePercentage');
        this.correctAnswers = document.getElementById('correctAnswers');
        this.wrongAnswers = document.getElementById('wrongAnswers');
        this.skippedAnswers = document.getElementById('skippedAnswers');
        this.totalTime = document.getElementById('totalTime');
        this.performanceMessage = document.getElementById('performanceMessage');
        this.reviewBtn = document.getElementById('reviewBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.homeBtn = document.getElementById('homeBtn');

        // Review screen elements
        this.backToResultsBtn = document.getElementById('backToResultsBtn');
        this.reviewQuestions = document.getElementById('reviewQuestions');
    }

    loadQuestions() {
        this.questionBank = {
            general: {
                easy: [
                    {
                        question: "What is the capital of France?",
                        answers: ["London", "Berlin", "Paris", "Madrid"],
                        correct: 2
                    },
                    {
                        question: "How many days are there in a leap year?",
                        answers: ["365", "366", "367", "364"],
                        correct: 1
                    },
                    {
                        question: "What is the largest planet in our solar system?",
                        answers: ["Earth", "Jupiter", "Saturn", "Neptune"],
                        correct: 1
                    },
                    {
                        question: "Which ocean is the largest?",
                        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
                        correct: 3
                    },
                    {
                        question: "What is 7 × 8?",
                        answers: ["54", "56", "58", "52"],
                        correct: 1
                    }
                ],
                medium: [
                    {
                        question: "In which year did World War II end?",
                        answers: ["1944", "1945", "1946", "1947"],
                        correct: 1
                    },
                    {
                        question: "What is the chemical symbol for gold?",
                        answers: ["Go", "Gd", "Au", "Ag"],
                        correct: 2
                    },
                    {
                        question: "Who painted the Mona Lisa?",
                        answers: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
                        correct: 2
                    },
                    {
                        question: "What is the square root of 144?",
                        answers: ["11", "12", "13", "14"],
                        correct: 1
                    },
                    {
                        question: "Which planet is known as the Red Planet?",
                        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
                        correct: 1
                    }
                ],
                hard: [
                    {
                        question: "What is the smallest prime number?",
                        answers: ["0", "1", "2", "3"],
                        correct: 2
                    },
                    {
                        question: "In what year was the Berlin Wall torn down?",
                        answers: ["1987", "1988", "1989", "1990"],
                        correct: 2
                    },
                    {
                        question: "What is the atomic number of carbon?",
                        answers: ["4", "6", "8", "12"],
                        correct: 1
                    },
                    {
                        question: "Who wrote '1984'?",
                        answers: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"],
                        correct: 1
                    },
                    {
                        question: "What is the derivative of x²?",
                        answers: ["x", "2x", "x²", "2x²"],
                        correct: 1
                    }
                ]
            },
            science: {
                easy: [
                    {
                        question: "What gas do plants absorb from the atmosphere during photosynthesis?",
                        answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                        correct: 2
                    },
                    {
                        question: "How many bones are there in an adult human body?",
                        answers: ["106", "206", "306", "406"],
                        correct: 1
                    },
                    {
                        question: "What is the chemical formula for water?",
                        answers: ["CO2", "H2O", "NaCl", "O2"],
                        correct: 1
                    },
                    {
                        question: "Which organ in the human body produces insulin?",
                        answers: ["Liver", "Kidney", "Pancreas", "Heart"],
                        correct: 2
                    },
                    {
                        question: "What is the speed of light in vacuum?",
                        answers: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                        correct: 0
                    }
                ],
                medium: [
                    {
                        question: "What is the pH value of pure water?",
                        answers: ["6", "7", "8", "9"],
                        correct: 1
                    },
                    {
                        question: "Which element has the atomic symbol 'Fe'?",
                        answers: ["Fluorine", "Iron", "Francium", "Fermium"],
                        correct: 1
                    },
                    {
                        question: "What type of bond holds the two strands of DNA together?",
                        answers: ["Ionic bonds", "Covalent bonds", "Hydrogen bonds", "Metallic bonds"],
                        correct: 2
                    },
                    {
                        question: "What is Newton's second law of motion?",
                        answers: ["F = ma", "E = mc²", "v = u + at", "P = mv"],
                        correct: 0
                    },
                    {
                        question: "Which blood type is known as the universal donor?",
                        answers: ["A", "B", "AB", "O"],
                        correct: 3
                    }
                ],
                hard: [
                    {
                        question: "What is Avogadro's number?",
                        answers: ["6.022 × 10²³", "3.14159", "2.718", "1.618"],
                        correct: 0
                    },
                    {
                        question: "Which organelle is known as the powerhouse of the cell?",
                        answers: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
                        correct: 2
                    },
                    {
                        question: "What is the uncertainty principle in quantum mechanics?",
                        answers: ["Heisenberg principle", "Schrödinger principle", "Pauli principle", "Bohr principle"],
                        correct: 0
                    },
                    {
                        question: "What is the most abundant gas in Earth's atmosphere?",
                        answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
                        correct: 2
                    },
                    {
                        question: "What is the half-life of Carbon-14?",
                        answers: ["5,730 years", "1,000 years", "10,000 years", "100,000 years"],
                        correct: 0
                    }
                ]
            },
            history: {
                easy: [
                    {
                        question: "Who was the first President of the United States?",
                        answers: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
                        correct: 2
                    },
                    {
                        question: "In which year did the Titanic sink?",
                        answers: ["1912", "1913", "1914", "1915"],
                        correct: 0
                    },
                    {
                        question: "Which ancient wonder of the world was located in Egypt?",
                        answers: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid of Giza", "Lighthouse of Alexandria"],
                        correct: 2
                    },
                    {
                        question: "Who was known as the 'Iron Lady'?",
                        answers: ["Queen Elizabeth II", "Margaret Thatcher", "Indira Gandhi", "Golda Meir"],
                        correct: 1
                    },
                    {
                        question: "Which empire was ruled by Julius Caesar?",
                        answers: ["Greek Empire", "Roman Empire", "Persian Empire", "Ottoman Empire"],
                        correct: 1
                    }
                ],
                medium: [
                    {
                        question: "The Cold War was primarily between which two superpowers?",
                        answers: ["USA and China", "USA and USSR", "UK and Germany", "France and Russia"],
                        correct: 1
                    },
                    {
                        question: "Who wrote the Communist Manifesto?",
                        answers: ["Lenin", "Stalin", "Marx and Engels", "Mao"],
                        correct: 2
                    },
                    {
                        question: "In which year did the Berlin Wall fall?",
                        answers: ["1987", "1988", "1989", "1990"],
                        correct: 2
                    },
                    {
                        question: "Which battle is considered the turning point of World War II in Europe?",
                        answers: ["Battle of Britain", "D-Day", "Battle of Stalingrad", "Battle of Berlin"],
                        correct: 2
                    },
                    {
                        question: "Who was the last Pharaoh of Egypt?",
                        answers: ["Tutankhamun", "Cleopatra VII", "Ramses II", "Akhenaten"],
                        correct: 1
                    }
                ],
                hard: [
                    {
                        question: "The Treaty of Westphalia (1648) ended which war?",
                        answers: ["Hundred Years' War", "Thirty Years' War", "Seven Years' War", "War of Spanish Succession"],
                        correct: 1
                    },
                    {
                        question: "Who was the Byzantine Emperor during the Great Schism of 1054?",
                        answers: ["Justinian I", "Constantine VII", "Constantine IX", "Basil II"],
                        correct: 2
                    },
                    {
                        question: "The Magna Carta was signed in which year?",
                        answers: ["1215", "1225", "1235", "1245"],
                        correct: 0
                    },
                    {
                        question: "Which dynasty ruled China during the construction of the Forbidden City?",
                        answers: ["Tang", "Song", "Ming", "Qing"],
                        correct: 2
                    },
                    {
                        question: "The Peace of Augsburg (1555) ended conflicts between which groups?",
                        answers: ["Catholics and Protestants", "Christians and Muslims", "Nobles and Peasants", "East and West"],
                        correct: 0
                    }
                ]
            },
            technology: {
                easy: [
                    {
                        question: "What does 'WWW' stand for?",
                        answers: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"],
                        correct: 0
                    },
                    {
                        question: "Which company created the iPhone?",
                        answers: ["Samsung", "Google", "Apple", "Microsoft"],
                        correct: 2
                    },
                    {
                        question: "What does 'CPU' stand for?",
                        answers: ["Computer Processing Unit", "Central Processing Unit", "Central Program Unit", "Computer Program Unit"],
                        correct: 1
                    },
                    {
                        question: "Which programming language is known for web development?",
                        answers: ["C++", "Java", "JavaScript", "Python"],
                        correct: 2
                    },
                    {
                        question: "What does 'USB' stand for?",
                        answers: ["Universal Serial Bus", "Universal System Bus", "United Serial Bus", "United System Bus"],
                        correct: 0
                    }
                ],
                medium: [
                    {
                        question: "Which protocol is used for secure web browsing?",
                        answers: ["HTTP", "HTTPS", "FTP", "SMTP"],
                        correct: 1
                    },
                    {
                        question: "What is the latest version of HTML?",
                        answers: ["HTML4", "HTML5", "HTML6", "XHTML"],
                        correct: 1
                    },
                    {
                        question: "Which database language is most commonly used?",
                        answers: ["MySQL", "SQL", "MongoDB", "Oracle"],
                        correct: 1
                    },
                    {
                        question: "What does 'API' stand for?",
                        answers: ["Application Programming Interface", "Advanced Programming Interface", "Application Program Interface", "Advanced Program Interface"],
                        correct: 0
                    },
                    {
                        question: "Which company developed the Java programming language?",
                        answers: ["Microsoft", "Apple", "Sun Microsystems", "IBM"],
                        correct: 2
                    }
                ],
                hard: [
                    {
                        question: "What is the time complexity of binary search?",
                        answers: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                        correct: 1
                    },
                    {
                        question: "Which design pattern ensures a class has only one instance?",
                        answers: ["Factory", "Observer", "Singleton", "Strategy"],
                        correct: 2
                    },
                    {
                        question: "What does 'REST' stand for in web services?",
                        answers: ["Representational State Transfer", "Remote State Transfer", "Representational System Transfer", "Remote System Transfer"],
                        correct: 0
                    },
                    {
                        question: "Which sorting algorithm has the best average time complexity?",
                        answers: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
                        correct: 1
                    },
                    {
                        question: "What is the default port for HTTPS?",
                        answers: ["80", "443", "8080", "3000"],
                        correct: 1
                    }
                ]
            },
            sports: {
                easy: [
                    {
                        question: "How many players are on a basketball team on the court at one time?",
                        answers: ["4", "5", "6", "7"],
                        correct: 1
                    },
                    {
                        question: "In which sport would you perform a slam dunk?",
                        answers: ["Volleyball", "Tennis", "Basketball", "Baseball"],
                        correct: 2
                    },
                    {
                        question: "How often are the Summer Olympic Games held?",
                        answers: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
                        correct: 2
                    },
                    {
                        question: "What is the maximum score possible in ten-pin bowling?",
                        answers: ["200", "250", "300", "350"],
                        correct: 2
                    },
                    {
                        question: "In soccer, how many players are on the field for each team?",
                        answers: ["10", "11", "12", "13"],
                        correct: 1
                    }
                ],
                medium: [
                    {
                        question: "Which country has won the most FIFA World Cups?",
                        answers: ["Germany", "Argentina", "Brazil", "Italy"],
                        correct: 2
                    },
                    {
                        question: "In tennis, what is the term for a score of 40-40?",
                        answers: ["Deuce", "Advantage", "Match point", "Set point"],
                        correct: 0
                    },
                    {
                        question: "How many holes are there in a standard round of golf?",
                        answers: ["16", "18", "20", "22"],
                        correct: 1
                    },
                    {
                        question: "Which athlete has won the most Olympic gold medals?",
                        answers: ["Usain Bolt", "Michael Phelps", "Carl Lewis", "Mark Spitz"],
                        correct: 1
                    },
                    {
                        question: "In American football, how many points is a touchdown worth?",
                        answers: ["3", "6", "7", "8"],
                        correct: 1
                    }
                ],
                hard: [
                    {
                        question: "Which Formula 1 driver has won the most world championships?",
                        answers: ["Ayrton Senna", "Michael Schumacher", "Lewis Hamilton", "Sebastian Vettel"],
                        correct: 1
                    },
                    {
                        question: "In cricket, what is the maximum number of runs that can be scored off a single ball?",
                        answers: ["4", "6", "8", "No limit"],
                        correct: 3
                    },
                    {
                        question: "Which team has won the most NBA championships?",
                        answers: ["Los Angeles Lakers", "Boston Celtics", "Chicago Bulls", "Golden State Warriors"],
                        correct: 1
                    },
                    {
                        question: "In professional cycling, what is the name of the famous French multi-stage race?",
                        answers: ["Giro d'Italia", "Tour de France", "Vuelta a España", "Paris-Roubaix"],
                        correct: 1
                    },
                    {
                        question: "Which country hosted the first modern Olympic Games in 1896?",
                        answers: ["France", "England", "Greece", "Germany"],
                        correct: 2
                    }
                ]
            },
            geography: {
                easy: [
                    {
                        question: "What is the capital of Australia?",
                        answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
                        correct: 2
                    },
                    {
                        question: "Which is the longest river in the world?",
                        answers: ["Amazon", "Nile", "Mississippi", "Yangtze"],
                        correct: 1
                    },
                    {
                        question: "How many continents are there?",
                        answers: ["5", "6", "7", "8"],
                        correct: 2
                    },
                    {
                        question: "Which country has the most time zones?",
                        answers: ["Russia", "USA", "China", "Canada"],
                        correct: 0
                    },
                    {
                        question: "What is the smallest country in the world?",
                        answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
                        correct: 1
                    }
                ],
                medium: [
                    {
                        question: "Which African country was never colonized?",
                        answers: ["Kenya", "Ethiopia", "Ghana", "Nigeria"],
                        correct: 1
                    },
                    {
                        question: "What is the capital of Kazakhstan?",
                        answers: ["Almaty", "Astana", "Bishkek", "Tashkent"],
                        correct: 1
                    },
                    {
                        question: "Which desert is the largest in the world?",
                        answers: ["Sahara", "Gobi", "Antarctica", "Arabian"],
                        correct: 2
                    },
                    {
                        question: "The Strait of Gibraltar separates which two countries?",
                        answers: ["Spain and Portugal", "Spain and Morocco", "France and Spain", "Italy and Tunisia"],
                        correct: 1
                    },
                    {
                        question: "Which mountain range contains Mount Everest?",
                        answers: ["Andes", "Rocky Mountains", "Himalayas", "Alps"],
                        correct: 2
                    }
                ],
                hard: [
                    {
                        question: "What is the capital of Bhutan?",
                        answers: ["Thimphu", "Paro", "Punakha", "Jakar"],
                        correct: 0
                    },
                    {
                        question: "Which country has the most UNESCO World Heritage Sites?",
                        answers: ["France", "Germany", "Italy", "Spain"],
                        correct: 2
                    },
                    {
                        question: "The Atacama Desert is located in which country?",
                        answers: ["Peru", "Bolivia", "Chile", "Argentina"],
                        correct: 2
                    },
                    {
                        question: "Which is the deepest lake in the world?",
                        answers: ["Lake Superior", "Lake Baikal", "Caspian Sea", "Lake Tanganyika"],
                        correct: 1
                    },
                    {
                        question: "What is the southernmost capital city in the world?",
                        answers: ["Canberra", "Buenos Aires", "Wellington", "Cape Town"],
                        correct: 2
                    }
                ]
            }
        };
    }

    bindEvents() {
        // Category selection
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedCategory = btn.dataset.category;
                this.updateCategoryDisplay();
            });
        });

        // Difficulty selection
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDifficulty = btn.dataset.difficulty;
            });
        });

        // Settings
        this.questionCountSelect.addEventListener('change', () => {
            this.questionCount = parseInt(this.questionCountSelect.value);
        });

        this.timeLimitSelect.addEventListener('change', () => {
            this.timeLimit = parseInt(this.timeLimitSelect.value);
        });

        // Start quiz
        this.startQuizBtn.addEventListener('click', () => this.startQuiz());

        // Quiz controls
        this.skipBtn.addEventListener('click', () => this.skipQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());

        // Results buttons
        this.reviewBtn.addEventListener('click', () => this.showReview());
        this.retryBtn.addEventListener('click', () => this.retryQuiz());
        this.homeBtn.addEventListener('click', () => this.goHome());

        // Review button
        this.backToResultsBtn.addEventListener('click', () => this.showResults());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.quizScreen.classList.contains('active')) {
                if (e.key >= '1' && e.key <= '4') {
                    const index = parseInt(e.key) - 1;
                    const answerBtns = this.answersContainer.querySelectorAll('.answer-btn');
                    if (answerBtns[index] && !answerBtns[index].classList.contains('disabled')) {
                        this.selectAnswer(index);
                    }
                } else if (e.key === ' ') {
                    e.preventDefault();
                    if (this.nextBtn.disabled) {
                        this.skipQuestion();
                    } else {
                        this.nextQuestion();
                    }
                }
            }
        });
    }

    updateCategoryDisplay() {
        const categoryNames = {
            general: 'General Knowledge',
            science: 'Science',
            history: 'History',
            technology: 'Technology',
            sports: 'Sports',
            geography: 'Geography'
        };
        this.categoryDisplay.textContent = categoryNames[this.selectedCategory];
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        
        // Get questions for selected category and difficulty
        const categoryQuestions = this.questionBank[this.selectedCategory][this.selectedDifficulty];
        
        // Shuffle and select questions
        this.questions = this.shuffleArray([...categoryQuestions]).slice(0, this.questionCount);
        
        // Add some questions from other categories for variety
        if (this.questions.length < this.questionCount) {
            const otherCategories = Object.keys(this.questionBank).filter(cat => cat !== this.selectedCategory);
            for (let category of otherCategories) {
                const extraQuestions = this.questionBank[category][this.selectedDifficulty];
                this.questions.push(...this.shuffleArray([...extraQuestions]).slice(0, 2));
                if (this.questions.length >= this.questionCount) break;
            }
            this.questions = this.questions.slice(0, this.questionCount);
        }

        this.showScreen('quizScreen');
        this.updateQuizHeader();
        this.displayQuestion();
        
        if (this.timeLimit > 0) {
            this.startTimer();
        } else {
            this.timerDisplay.style.display = 'none';
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        
        this.answersContainer.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.innerHTML = `
                <span class="answer-letter">${letters[index]}</span>
                <span class="answer-text">${answer}</span>
            `;
            button.addEventListener('click', () => this.selectAnswer(index));
            this.answersContainer.appendChild(button);
        });

        this.nextBtn.disabled = true;
        this.updateProgress();
    }

    selectAnswer(selectedIndex) {
        const answerBtns = this.answersContainer.querySelectorAll('.answer-btn');
        
        // Remove previous selections
        answerBtns.forEach(btn => btn.classList.remove('selected'));
        
        // Select current answer
        answerBtns[selectedIndex].classList.add('selected');
        
        // Store user answer
        this.userAnswers[this.currentQuestionIndex] = {
            selected: selectedIndex,
            correct: this.questions[this.currentQuestionIndex].correct,
            skipped: false
        };

        this.nextBtn.disabled = false;
    }

    skipQuestion() {
        this.userAnswers[this.currentQuestionIndex] = {
            selected: -1,
            correct: this.questions[this.currentQuestionIndex].correct,
            skipped: true
        };
        this.nextQuestion();
    }

    nextQuestion() {
        // Check if answer was correct
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        if (!userAnswer.skipped && userAnswer.selected === userAnswer.correct) {
            this.score++;
            this.currentScoreSpan.textContent = this.score;
        }

        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.updateQuizHeader();
            this.displayQuestion();
            this.resetTimer();
        } else {
            this.endQuiz();
        }
    }

    startTimer() {
        this.timeLeft = this.timeLimit;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 5) {
                this.timerDisplay.classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.skipQuestion();
            }
        }, 1000);
    }

    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        if (this.timeLimit > 0) {
            this.timerDisplay.classList.remove('warning');
            this.startTimer();
        }
    }

    updateTimerDisplay() {
        this.timeLeftSpan.textContent = this.timeLeft;
    }

    updateQuizHeader() {
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsSpan.textContent = this.questions.length;
        this.updateCategoryDisplay();
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    endQuiz() {
        this.endTime = Date.now();
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.showResults();
    }

    showResults() {
        this.showScreen('resultsScreen');
        
        const correctCount = this.userAnswers.filter(answer => 
            !answer.skipped && answer.selected === answer.correct
        ).length;
        
        const wrongCount = this.userAnswers.filter(answer => 
            !answer.skipped && answer.selected !== answer.correct
        ).length;
        
        const skippedCount = this.userAnswers.filter(answer => answer.skipped).length;
        
        const percentage = Math.round((correctCount / this.questions.length) * 100);
        const totalTimeSeconds = Math.round((this.endTime - this.startTime) / 1000);

        // Update score display
        this.finalScore.textContent = correctCount;
        this.finalTotal.textContent = this.questions.length;
        this.scorePercentage.textContent = `${percentage}%`;
        
        // Update stats
        this.correctAnswers.textContent = correctCount;
        this.wrongAnswers.textContent = wrongCount;
        this.skippedAnswers.textContent = skippedCount;
        this.totalTime.textContent = `${totalTimeSeconds}s`;

        // Update performance message and trophy
        this.updatePerformanceMessage(percentage);
    }

    updatePerformanceMessage(percentage) {
        let message = '';
        let trophy = '🏆';
        let title = 'Quiz Complete!';

        if (percentage >= 90) {
            trophy = '🥇';
            title = 'Outstanding!';
            message = 'Exceptional performance! You\'ve mastered this topic. You\'re clearly an expert in this field!';
        } else if (percentage >= 80) {
            trophy = '🥈';
            title = 'Excellent!';
            message = 'Great job! You have a strong understanding of the subject. Keep up the excellent work!';
        } else if (percentage >= 70) {
            trophy = '🥉';
            title = 'Well Done!';
            message = 'Good performance! You have a solid grasp of the basics. A little more practice will make you perfect!';
        } else if (percentage >= 60) {
            trophy = '📚';
            title = 'Good Effort!';
            message = 'Not bad! You\'re on the right track. Some more study and practice will help you improve significantly.';
        } else if (percentage >= 40) {
            trophy = '💪';
            title = 'Keep Trying!';
            message = 'You\'re getting there! This topic needs more attention. Don\'t give up - practice makes perfect!';
        } else {
            trophy = '📖';
            title = 'Learning Opportunity!';
            message = 'This is a great learning opportunity! Consider reviewing the material and trying again. Every expert was once a beginner!';
        }

        this.trophyIcon.textContent = trophy;
        this.resultsTitle.textContent = title;
        this.resultsMessage.textContent = 'Quiz completed successfully!';
        this.performanceMessage.textContent = message;
    }

    showReview() {
        this.showScreen('reviewScreen');
        this.displayReview();
    }

    displayReview() {
        this.reviewQuestions.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-question';
            
            let statusClass = '';
            let statusText = '';
            
            if (userAnswer.skipped) {
                statusClass = 'skipped';
                statusText = 'Skipped';
            } else if (userAnswer.selected === userAnswer.correct) {
                statusClass = 'correct';
                statusText = 'Correct';
            } else {
                statusClass = 'wrong';
                statusText = 'Wrong';
            }
            
            reviewItem.classList.add(statusClass);
            
            const letters = ['A', 'B', 'C', 'D'];
            
            reviewItem.innerHTML = `
                <div class="review-question-header">
                    <span class="review-question-number">Question ${index + 1}</span>
                    <span class="review-status ${statusClass}">${statusText}</span>
                </div>
                <div class="review-question-text">${question.question}</div>
                <div class="review-answers">
                    ${question.answers.map((answer, answerIndex) => {
                        let answerClass = 'review-answer';
                        if (answerIndex === userAnswer.correct) {
                            answerClass += ' correct-answer';
                        }
                        if (answerIndex === userAnswer.selected && userAnswer.selected !== userAnswer.correct) {
                            answerClass += ' wrong-selected';
                        }
                        if (answerIndex === userAnswer.selected) {
                            answerClass += ' user-selected';
                        }
                        
                        return `
                            <div class="${answerClass}">
                                <span class="answer-letter">${letters[answerIndex]}</span>
                                <span class="answer-text">${answer}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            this.reviewQuestions.appendChild(reviewItem);
        });
    }

    retryQuiz() {
        this.goHome();
    }

    goHome() {
        this.showScreen('welcomeScreen');
        
        // Reset selections
        this.categoryButtons.forEach(btn => btn.classList.remove('selected'));
        this.categoryButtons[0].classList.add('selected');
        this.selectedCategory = 'general';
        
        this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
        this.difficultyButtons[0].classList.add('active');
        this.selectedDifficulty = 'easy';
        
        this.questionCountSelect.value = '10';
        this.timeLimitSelect.value = '30';
        this.questionCount = 10;
        this.timeLimit = 30;
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize the quiz app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
