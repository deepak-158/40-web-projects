// Alright, let's make this quote generator come to life!
// This is gonna be fun - I love working with inspirational content

class QuoteGenerator {
    constructor() {
        // Setting up all the quotes - I spent some time collecting these gems
        this.quotes = {
            motivational: [
                { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                { text: "Your limitation—it's only your imagination.", author: "Unknown" },
                { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
                { text: "Great things never come from comfort zones.", author: "Unknown" },
                { text: "Dream it. Wish it. Do it.", author: "Unknown" },
                { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
                { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
                { text: "Dream bigger. Do bigger.", author: "Unknown" },
                { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" }
            ],
            wisdom: [
                { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
                { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
                { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
                { text: "The unexamined life is not worth living.", author: "Socrates" },
                { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
                { text: "The fool doth think he is wise, but the wise man knows himself to be a fool.", author: "William Shakespeare" },
                { text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.", author: "Bill Keane" },
                { text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.", author: "Bruce Lee" },
                { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
                { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" }
            ],
            success: [
                { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
                { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
                { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
                { text: "The real test is not whether you avoid this failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it; whether you choose to persevere.", author: "Barack Obama" },
                { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
                { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
                { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
                { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
                { text: "Success is going from failure to failure without losing your enthusiasm.", author: "Winston Churchill" }
            ],
            life: [
                { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
                { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
                { text: "Get busy living or get busy dying.", author: "Stephen King" },
                { text: "You have a choice to make every day: you can make your life better or you can make it worse.", author: "Unknown" },
                { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
                { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
                { text: "Life is short, and it is up to you to make it sweet.", author: "Sarah Louise Delany" },
                { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
                { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
                { text: "The good life is one inspired by love and guided by knowledge.", author: "Bertrand Russell" }
            ],
            love: [
                { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
                { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
                { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
                { text: "I have found the paradox, that if you love until it hurts, there can be no more hurt, only more love.", author: "Mother Teresa" },
                { text: "Love all, trust a few, do wrong to none.", author: "William Shakespeare" },
                { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
                { text: "Love yourself first and everything else falls into line.", author: "Lucille Ball" },
                { text: "The greatest happiness of life is the conviction that we are loved.", author: "Victor Hugo" },
                { text: "Love is not about how much you say 'I love you,' but how much you can prove that it's true.", author: "Unknown" },
                { text: "Love is the bridge between you and everything.", author: "Rumi" }
            ],
            friendship: [
                { text: "A friend is someone who knows all about you and still loves you.", author: "Elbert Hubbard" },
                { text: "Friendship is born at that moment when one person says to another: 'What! You too? I thought I was the only one.'", author: "C.S. Lewis" },
                { text: "A true friend is never truly forgotten.", author: "Unknown" },
                { text: "Friendship is the only cement that will ever hold the world together.", author: "Woodrow Wilson" },
                { text: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
                { text: "The greatest gift of life is friendship, and I have received it.", author: "Hubert H. Humphrey" },
                { text: "Friendship is not about who you've known the longest. It's about who walked into your life and said 'I'm here for you' and proved it.", author: "Unknown" },
                { text: "True friendship comes when the silence between two people is comfortable.", author: "David Tyson" },
                { text: "Friends are the family you choose.", author: "Jess C. Scott" },
                { text: "In the cookie of life, friends are the chocolate chips.", author: "Salman Rushdie" }
            ],
            happiness: [
                { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
                { text: "The only way to find true happiness is to risk being completely cut open.", author: "Chuck Palahniuk" },
                { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
                { text: "The secret of happiness is not in doing what one likes, but in liking what one does.", author: "James M. Barrie" },
                { text: "Happiness depends upon ourselves.", author: "Aristotle" },
                { text: "The happiest people don't have the best of everything, they just make the best of everything.", author: "Unknown" },
                { text: "Happiness is a choice, not a result.", author: "Ralph Marston" },
                { text: "Be happy for this moment. This moment is your life.", author: "Omar Khayyam" },
                { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
                { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" }
            ]
        };

        // All the DOM elements I'll be working with
        this.elements = {
            quoteText: document.getElementById('quoteText'),
            quoteAuthor: document.getElementById('quoteAuthor'),
            newQuoteBtn: document.getElementById('newQuoteBtn'),
            favoriteBtn: document.getElementById('favoriteBtn'),
            copyBtn: document.getElementById('copyBtn'),
            shareBtn: document.getElementById('shareBtn'),
            tweetBtn: document.getElementById('tweetBtn'),
            categoryBtns: document.querySelectorAll('.category-btn'),
            quotesViewedCount: document.getElementById('quotesViewedCount'),
            favoritesCount: document.getElementById('favoritesCount'),
            sharesCount: document.getElementById('sharesCount'),
            toggleFavoritesBtn: document.getElementById('toggleFavoritesBtn'),
            favoritesContainer: document.getElementById('favoritesContainer'),
            favoritesList: document.getElementById('favoritesList'),
            clearFavoritesBtn: document.getElementById('clearFavoritesBtn'),
            exportFavoritesBtn: document.getElementById('exportFavoritesBtn'),
            toast: document.getElementById('toast'),
            loadingSpinner: document.getElementById('loadingSpinner'),
            quoteCard: document.getElementById('quoteCard')
        };

        // Keeping track of the current state
        this.currentQuote = null;
        this.currentCategory = 'all';
        this.favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
        this.stats = JSON.parse(localStorage.getItem('quoteStats')) || {
            quotesViewed: 0,
            sharesCount: 0
        };

        // Let's get this party started!
        this.init();
    }

    init() {
        // Setting up all the event listeners - this is where the magic happens
        this.setupEventListeners();
        this.updateStatistics();
        this.showFirstQuote();
    }

    setupEventListeners() {
        // Main quote button - this is the star of the show
        this.elements.newQuoteBtn.addEventListener('click', () => this.generateNewQuote());

        // Action buttons for each quote
        this.elements.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        this.elements.copyBtn.addEventListener('click', () => this.copyQuote());
        this.elements.shareBtn.addEventListener('click', () => this.shareQuote());
        this.elements.tweetBtn.addEventListener('click', () => this.tweetQuote());

        // Category selection - love how this makes the experience more personal
        this.elements.categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCategory(e.target.dataset.category));
        });

        // Favorites management
        this.elements.toggleFavoritesBtn.addEventListener('click', () => this.toggleFavorites());
        this.elements.clearFavoritesBtn.addEventListener('click', () => this.clearAllFavorites());
        this.elements.exportFavoritesBtn.addEventListener('click', () => this.exportFavorites());

        // Keyboard shortcuts because I'm all about that UX
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.generateNewQuote();
            }
        });
    }

    showFirstQuote() {
        // Starting with a nice welcome message, but let's make it more engaging
        setTimeout(() => {
            this.generateNewQuote();
        }, 1000);
    }

    generateNewQuote() {
        // Show that cool loading animation
        this.showLoading();

        // Simulate a tiny delay to make it feel more natural (like it's actually fetching)
        setTimeout(() => {
            const quote = this.getRandomQuote();
            this.displayQuote(quote);
            this.updateQuoteViewCount();
            this.hideLoading();
        }, Math.random() * 800 + 200); // Random delay between 200-1000ms
    }

    getRandomQuote() {
        let availableQuotes;
        
        if (this.currentCategory === 'all') {
            // Combine all categories - this was trickier than I thought!
            availableQuotes = [];
            Object.values(this.quotes).forEach(categoryQuotes => {
                availableQuotes.push(...categoryQuotes);
            });
        } else {
            availableQuotes = this.quotes[this.currentCategory] || [];
        }

        // Make sure we don't show the same quote twice in a row
        let quote;
        let attempts = 0;
        do {
            quote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
            attempts++;
        } while (quote === this.currentQuote && attempts < 10 && availableQuotes.length > 1);

        this.currentQuote = quote;
        return quote;
    }

    displayQuote(quote) {
        // Adding a nice fade-out and fade-in effect
        this.elements.quoteCard.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.quoteText.textContent = quote.text;
            this.elements.quoteAuthor.textContent = `— ${quote.author}`;
            
            // Check if this quote is already in favorites
            const isFavorite = this.favorites.some(fav => 
                fav.text === quote.text && fav.author === quote.author
            );
            
            this.elements.favoriteBtn.classList.toggle('active', isFavorite);
            this.elements.quoteCard.style.opacity = '1';
        }, 150);
    }

    selectCategory(category) {
        // Update the active category button
        this.elements.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.currentCategory = category;
        this.generateNewQuote();
        
        // Little feedback for the user
        this.showToast(`Switched to ${category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)} quotes`);
    }

    toggleFavorite() {
        if (!this.currentQuote) return;

        const existingIndex = this.favorites.findIndex(fav => 
            fav.text === this.currentQuote.text && fav.author === this.currentQuote.author
        );

        if (existingIndex > -1) {
            // Remove from favorites
            this.favorites.splice(existingIndex, 1);
            this.elements.favoriteBtn.classList.remove('active');
            this.showToast('Removed from favorites', 'info');
        } else {
            // Add to favorites
            this.favorites.push({
                ...this.currentQuote,
                dateAdded: new Date().toISOString()
            });
            this.elements.favoriteBtn.classList.add('active');
            this.showToast('Added to favorites! ❤️', 'success');
        }

        this.saveFavorites();
        this.updateStatistics();
        this.updateFavoritesList();
    }

    copyQuote() {
        if (!this.currentQuote) return;

        const quoteText = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
        
        // Modern clipboard API with fallback
        if (navigator.clipboard) {
            navigator.clipboard.writeText(quoteText).then(() => {
                this.showToast('Quote copied to clipboard! 📋', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = quoteText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Quote copied to clipboard! 📋', 'success');
        }
    }

    shareQuote() {
        if (!this.currentQuote) return;

        const quoteText = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
        
        // Check if Web Share API is supported (mostly mobile)
        if (navigator.share) {
            navigator.share({
                title: 'Inspiring Quote',
                text: quoteText,
                url: window.location.href
            }).then(() => {
                this.updateShareCount();
                this.showToast('Quote shared successfully! 📤', 'success');
            }).catch(err => {
                // User probably cancelled, no big deal
                console.log('Share cancelled');
            });
        } else {
            // Fallback - copy to clipboard
            this.copyQuote();
            this.updateShareCount();
        }
    }

    tweetQuote() {
        if (!this.currentQuote) return;

        const quoteText = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}&hashtags=inspiration,quotes,motivation`;
        
        window.open(tweetUrl, '_blank', 'width=550,height=420');
        this.updateShareCount();
        this.showToast('Opening Twitter to share your quote! 🐦', 'info');
    }

    toggleFavorites() {
        const isVisible = this.elements.favoritesContainer.style.display !== 'none';
        
        if (isVisible) {
            this.elements.favoritesContainer.style.display = 'none';
            this.elements.toggleFavoritesBtn.textContent = 'Show Favorites';
        } else {
            this.elements.favoritesContainer.style.display = 'block';
            this.elements.toggleFavoritesBtn.textContent = 'Hide Favorites';
            this.updateFavoritesList();
        }
    }

    updateFavoritesList() {
        if (this.favorites.length === 0) {
            this.elements.favoritesList.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart-broken"></i>
                    <p>No favorite quotes yet. Click the heart button on quotes you love!</p>
                </div>
            `;
            return;
        }

        // Sort favorites by date added (newest first)
        const sortedFavorites = [...this.favorites].sort((a, b) => 
            new Date(b.dateAdded) - new Date(a.dateAdded)
        );

        this.elements.favoritesList.innerHTML = sortedFavorites.map(quote => `
            <div class="favorite-item">
                <div class="favorite-quote">
                    <p class="favorite-text">"${quote.text}"</p>
                    <div class="favorite-author">— ${quote.author}</div>
                </div>
                <button class="btn btn-icon remove-favorite" onclick="quoteGenerator.removeFavorite('${quote.text}', '${quote.author}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeFavorite(text, author) {
        // Remove specific favorite
        this.favorites = this.favorites.filter(fav => 
            !(fav.text === text && fav.author === author)
        );
        
        this.saveFavorites();
        this.updateStatistics();
        this.updateFavoritesList();
        
        // Update the current quote's favorite status if it matches
        if (this.currentQuote && this.currentQuote.text === text && this.currentQuote.author === author) {
            this.elements.favoriteBtn.classList.remove('active');
        }
        
        this.showToast('Removed from favorites', 'info');
    }

    clearAllFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('No favorites to clear!', 'info');
            return;
        }

        // Simple confirmation
        if (confirm(`Are you sure you want to clear all ${this.favorites.length} favorite quotes?`)) {
            this.favorites = [];
            this.saveFavorites();
            this.updateStatistics();
            this.updateFavoritesList();
            this.elements.favoriteBtn.classList.remove('active');
            this.showToast('All favorites cleared', 'info');
        }
    }

    exportFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('No favorites to export!', 'info');
            return;
        }

        // Create a nice text format for export
        const exportText = this.favorites.map(quote => 
            `"${quote.text}" — ${quote.author}\nAdded: ${new Date(quote.dateAdded).toLocaleDateString()}\n`
        ).join('\n');

        // Create and download file
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-favorite-quotes-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast(`Exported ${this.favorites.length} favorite quotes! 📁`, 'success');
    }

    updateQuoteViewCount() {
        this.stats.quotesViewed++;
        this.saveStats();
        this.updateStatistics();
    }

    updateShareCount() {
        this.stats.sharesCount++;
        this.saveStats();
        this.updateStatistics();
    }

    updateStatistics() {
        // Update all the stats displays with nice animations
        this.animateNumber(this.elements.quotesViewedCount, this.stats.quotesViewed);
        this.animateNumber(this.elements.favoritesCount, this.favorites.length);
        this.animateNumber(this.elements.sharesCount, this.stats.sharesCount);
    }    animateNumber(element, targetValue) {
        // Simple number counting animation - looks much cooler than just setting the value
        const currentValue = parseInt(element.textContent) || 0;
        
        // If the difference is small or we're going down, just set it directly
        if (Math.abs(targetValue - currentValue) <= 1 || targetValue < currentValue) {
            element.textContent = targetValue;
            return;
        }
        
        const increment = targetValue > currentValue ? 1 : -1;
        const steps = Math.abs(targetValue - currentValue);
        const stepDuration = Math.min(50, 1000 / steps); // Max 50ms per step, but adjust for large differences
        
        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, stepDuration);
    }

    showLoading() {
        this.elements.loadingSpinner.style.display = 'flex';
        this.elements.newQuoteBtn.disabled = true;
    }

    hideLoading() {
        this.elements.loadingSpinner.style.display = 'none';
        this.elements.newQuoteBtn.disabled = false;
    }

    showToast(message, type = 'info') {
        // Toast notifications for user feedback - I love these little touches
        this.elements.toast.textContent = message;
        this.elements.toast.className = `toast show ${type}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }

    saveFavorites() {
        localStorage.setItem('favoriteQuotes', JSON.stringify(this.favorites));
    }

    saveStats() {
        localStorage.setItem('quoteStats', JSON.stringify(this.stats));
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Making it globally available so the HTML onclick handlers work
    window.quoteGenerator = new QuoteGenerator();
});

// Some nice keyboard shortcuts and Easter eggs
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for new quote
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (window.quoteGenerator) {
            window.quoteGenerator.generateNewQuote();
        }
    }
    
    // Ctrl/Cmd + F for favorite
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (window.quoteGenerator) {
            window.quoteGenerator.toggleFavorite();
        }
    }
});

// Just a little console message for fellow developers who might peek
console.log('🌟 Welcome to the Quote Generator! Press spacebar for a new quote, or Ctrl+K for keyboard shortcuts!');
