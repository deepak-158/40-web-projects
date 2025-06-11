// Recipe Finder - JavaScript Functionality
// Uses Spoonacular API for recipe data

class RecipeFinder {
    constructor() {
        // API Configuration
        this.apiKey = '765f2b57859c4263894b2c63186bb924';
        this.baseUrl = 'https://api.spoonacular.com/recipes';
        
        // Application State
        this.currentPage = 1;
        this.totalResults = 0;
        this.resultsPerPage = 12;
        this.currentQuery = '';
        this.currentFilters = {};
        this.favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        
        // DOM Elements
        this.initializeElements();
        
        // Event Listeners
        this.initializeEventListeners();
        
        // Load favorites on startup
        this.displayFavorites();
        
        // Demo data for when API is not available
        this.initializeDemoData();
    }

    initializeElements() {
        // Search Elements
        this.heroSearchInput = document.getElementById('heroSearchInput');
        this.heroSearchBtn = document.getElementById('heroSearchBtn');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        
        // Filter Elements
        this.cuisineFilter = document.getElementById('cuisineFilter');
        this.dietFilter = document.getElementById('dietFilter');
        this.mealTypeFilter = document.getElementById('mealTypeFilter');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        
        // Results Elements
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.searchResults = document.getElementById('searchResults');
        this.pagination = document.getElementById('pagination');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.pageInfo = document.getElementById('pageInfo');
        
        // Modal Elements
        this.recipeModal = document.getElementById('recipeModal');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.querySelector('.modal-close');
        
        // Favorites Elements
        this.favoritesContainer = document.getElementById('favoritesContainer');
        
        // Navigation Elements
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Notification Container
        this.notificationContainer = document.getElementById('notificationContainer');
    }

    initializeEventListeners() {
        // Search Event Listeners
        this.heroSearchBtn.addEventListener('click', () => this.handleHeroSearch());
        this.heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleHeroSearch();
        });
        
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Filter Event Listeners
        this.cuisineFilter.addEventListener('change', () => this.handleFilterChange());
        this.dietFilter.addEventListener('change', () => this.handleFilterChange());
        this.mealTypeFilter.addEventListener('change', () => this.handleFilterChange());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        
        // Pagination Event Listeners
        this.prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        
        // Modal Event Listeners
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.recipeModal.addEventListener('click', (e) => {
            if (e.target === this.recipeModal) this.closeModal();
        });
        
        // Navigation Event Listeners
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    // Demo data for when API is not available
    initializeDemoData() {        this.demoRecipes = [
            {
                id: 1,
                title: "Spaghetti Carbonara",
                image: "https://spoonacular.com/recipeImages/715538-556x370.jpg",
                readyInMinutes: 30,
                servings: 4,
                healthScore: 85,
                summary: "A classic Italian pasta dish with eggs, cheese, and pancetta.",
                cuisines: ["Italian"],
                diets: [],
                dishTypes: ["lunch", "dinner"],
                extendedIngredients: [
                    { original: "400g spaghetti pasta" },
                    { original: "200g pancetta or guanciale, diced" },
                    { original: "4 large eggs" },
                    { original: "100g Pecorino Romano cheese, grated" },
                    { original: "Black pepper to taste" },
                    { original: "Salt for pasta water" }
                ],
                analyzedInstructions: [{
                    steps: [
                        { step: "Bring a large pot of salted water to boil and cook spaghetti according to package directions." },
                        { step: "While pasta cooks, heat a large skillet and cook pancetta until crispy." },
                        { step: "In a bowl, whisk together eggs, cheese, and black pepper." },
                        { step: "Drain pasta, reserving 1 cup pasta water." },
                        { step: "Add hot pasta to the pancetta and remove from heat." },
                        { step: "Quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce." }
                    ]
                }]
            },            {
                id: 2,
                title: "Chicken Tikka Masala",
                image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
                readyInMinutes: 45,
                servings: 6,
                healthScore: 75,
                summary: "Tender chicken in a rich, creamy tomato sauce with aromatic spices.",
                cuisines: ["Indian"],
                diets: ["gluten-free"],
                dishTypes: ["lunch", "dinner"],
                extendedIngredients: [
                    { original: "1 kg chicken breast, cubed" },
                    { original: "400ml coconut milk" },
                    { original: "400g canned tomatoes" },
                    { original: "2 onions, diced" },
                    { original: "4 cloves garlic, minced" },
                    { original: "2 tbsp garam masala" },
                    { original: "1 tbsp curry powder" },
                    { original: "Fresh cilantro for garnish" }
                ],
                analyzedInstructions: [{
                    steps: [
                        { step: "Marinate chicken in yogurt and spices for 30 minutes." },
                        { step: "Cook chicken in a hot pan until browned and set aside." },
                        { step: "Sauté onions and garlic until fragrant." },
                        { step: "Add spices and cook for 1 minute." },
                        { step: "Add tomatoes and simmer for 10 minutes." },
                        { step: "Stir in coconut milk and cooked chicken." },
                        { step: "Simmer until sauce thickens and garnish with cilantro." }
                    ]
                }]
            },            {
                id: 3,
                title: "Vegetarian Buddha Bowl",
                image: "https://spoonacular.com/recipeImages/715769-556x370.jpg",
                readyInMinutes: 25,
                servings: 2,
                healthScore: 95,
                summary: "A nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing.",
                cuisines: ["Mediterranean"],
                diets: ["vegetarian", "vegan", "gluten-free"],
                dishTypes: ["lunch", "dinner"],
                extendedIngredients: [
                    { original: "1 cup quinoa" },
                    { original: "2 cups mixed vegetables (broccoli, carrots, bell peppers)" },
                    { original: "1 avocado, sliced" },
                    { original: "2 tbsp tahini" },
                    { original: "1 lemon, juiced" },
                    { original: "2 tbsp olive oil" },
                    { original: "Salt and pepper to taste" },
                    { original: "Pumpkin seeds for topping" }
                ],
                analyzedInstructions: [{
                    steps: [
                        { step: "Cook quinoa according to package instructions." },
                        { step: "Roast vegetables at 400°F for 20 minutes." },
                        { step: "Mix tahini, lemon juice, and olive oil for dressing." },
                        { step: "Arrange quinoa in bowls." },
                        { step: "Top with roasted vegetables and avocado." },
                        { step: "Drizzle with tahini dressing and sprinkle with pumpkin seeds." }
                    ]
                }]
            },            {
                id: 4,
                title: "Chocolate Chip Cookies",
                image: "https://spoonacular.com/recipeImages/157344-556x370.jpg",
                readyInMinutes: 35,
                servings: 24,
                healthScore: 40,
                summary: "Classic homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
                cuisines: ["American"],
                diets: ["vegetarian"],
                dishTypes: ["dessert", "snack"],
                extendedIngredients: [
                    { original: "2¼ cups all-purpose flour" },
                    { original: "1 cup butter, softened" },
                    { original: "¾ cup brown sugar" },
                    { original: "½ cup white sugar" },
                    { original: "2 large eggs" },
                    { original: "2 tsp vanilla extract" },
                    { original: "1 tsp baking soda" },
                    { original: "1 tsp salt" },
                    { original: "2 cups chocolate chips" }
                ],
                analyzedInstructions: [{
                    steps: [
                        { step: "Preheat oven to 375°F and line baking sheets with parchment." },
                        { step: "Cream butter and sugars until light and fluffy." },
                        { step: "Beat in eggs and vanilla extract." },
                        { step: "Mix in flour, baking soda, and salt until just combined." },
                        { step: "Fold in chocolate chips." },
                        { step: "Drop rounded tablespoons of dough onto baking sheets." },
                        { step: "Bake for 9-11 minutes until golden brown." }
                    ]
                }]
            },            {
                id: 5,
                title: "Greek Salad",
                image: "https://spoonacular.com/recipeImages/634629-556x370.jpg",
                readyInMinutes: 15,
                servings: 4,
                healthScore: 90,
                summary: "Fresh Mediterranean salad with cucumbers, tomatoes, olives, and feta cheese.",
                cuisines: ["Mediterranean", "Greek"],
                diets: ["vegetarian", "gluten-free"],
                dishTypes: ["lunch", "snack"],
                extendedIngredients: [
                    { original: "4 large tomatoes, cut into wedges" },
                    { original: "1 cucumber, sliced" },
                    { original: "1 red onion, thinly sliced" },
                    { original: "200g feta cheese, cubed" },
                    { original: "½ cup Kalamata olives" },
                    { original: "¼ cup olive oil" },
                    { original: "2 tbsp red wine vinegar" },
                    { original: "1 tsp dried oregano" },
                    { original: "Salt and pepper to taste" }
                ],
                analyzedInstructions: [{
                    steps: [
                        { step: "Combine tomatoes, cucumber, and red onion in a large bowl." },
                        { step: "Add feta cheese and olives." },
                        { step: "Whisk together olive oil, vinegar, and oregano." },
                        { step: "Pour dressing over salad and toss gently." },
                        { step: "Season with salt and pepper." },
                        { step: "Let sit for 10 minutes before serving to allow flavors to meld." }
                    ]
                }]
            },            {
                id: 6,
                title: "Beef Tacos",
                image: "https://spoonacular.com/recipeImages/715594-556x370.jpg",
                readyInMinutes: 20,
                servings: 4,
                healthScore: 70,
                summary: "Delicious ground beef tacos with fresh toppings and homemade salsa.",
                cuisines: ["Mexican"],
                diets: ["gluten-free"],
                dishTypes: ["lunch", "dinner"],
                extendedIngredients: [
                    { original: "500g ground beef" },
                    { original: "8 corn tortillas" },
                    { original: "1 onion, diced" },
                    { original: "2 cloves garlic, minced" },
                    { original: "1 packet taco seasoning" },
                    { original: "1 cup shredded lettuce" },
                    { original: "1 cup diced tomatoes" },
                    { original: "½ cup shredded cheddar cheese" },
                    { original: "Sour cream and lime wedges for serving" }
                ],
                analyzedInstructions: [{
                    steps: [
                        { step: "Cook ground beef with onion and garlic until browned." },
                        { step: "Add taco seasoning and cook according to package directions." },
                        { step: "Warm tortillas in a dry skillet or microwave." },
                        { step: "Fill tortillas with beef mixture." },
                        { step: "Top with lettuce, tomatoes, and cheese." },
                        { step: "Serve with sour cream and lime wedges." }
                    ]
                }]
            }
        ];
    }

    // Handle hero search
    handleHeroSearch() {
        const query = this.heroSearchInput.value.trim();
        if (query) {
            this.searchInput.value = query;
            this.currentQuery = query;
            this.currentPage = 1;
            this.performSearch();
            // Scroll to search results
            document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Handle main search
    handleSearch() {
        const query = this.searchInput.value.trim();
        if (query || Object.keys(this.currentFilters).length > 0) {
            this.currentQuery = query;
            this.currentPage = 1;
            this.performSearch();
        } else {
            this.showNotification('Please enter a search term or select filters', 'warning');
        }
    }

    // Handle filter changes
    handleFilterChange() {
        this.currentFilters = {
            cuisine: this.cuisineFilter.value,
            diet: this.dietFilter.value,
            type: this.mealTypeFilter.value
        };
        
        // Remove empty filters
        Object.keys(this.currentFilters).forEach(key => {
            if (!this.currentFilters[key]) {
                delete this.currentFilters[key];
            }
        });
        
        this.currentPage = 1;
        this.performSearch();
    }

    // Clear all filters
    clearFilters() {
        this.cuisineFilter.value = '';
        this.dietFilter.value = '';
        this.mealTypeFilter.value = '';
        this.currentFilters = {};
        this.currentPage = 1;
        
        if (this.currentQuery) {
            this.performSearch();
        } else {
            this.clearResults();
        }
        
        this.showNotification('Filters cleared', 'success');
    }

    // Perform search (using demo data)
    async performSearch() {
        this.showLoading(true);
        
        try {
            // Simulate API delay
            await this.delay(800);
            
            // Filter demo recipes based on search criteria
            let filteredRecipes = this.demoRecipes;
            
            // Apply text search
            if (this.currentQuery) {
                const query = this.currentQuery.toLowerCase();
                filteredRecipes = filteredRecipes.filter(recipe => 
                    recipe.title.toLowerCase().includes(query) ||
                    recipe.summary.toLowerCase().includes(query) ||
                    recipe.cuisines.some(cuisine => cuisine.toLowerCase().includes(query))
                );
            }
            
            // Apply filters
            if (this.currentFilters.cuisine) {
                filteredRecipes = filteredRecipes.filter(recipe =>
                    recipe.cuisines.some(cuisine => 
                        cuisine.toLowerCase() === this.currentFilters.cuisine.toLowerCase()
                    )
                );
            }
            
            if (this.currentFilters.diet) {
                filteredRecipes = filteredRecipes.filter(recipe =>
                    recipe.diets.includes(this.currentFilters.diet)
                );
            }
            
            if (this.currentFilters.type) {
                filteredRecipes = filteredRecipes.filter(recipe =>
                    recipe.dishTypes.includes(this.currentFilters.type)
                );
            }
            
            this.totalResults = filteredRecipes.length;
            
            // Paginate results
            const startIndex = (this.currentPage - 1) * this.resultsPerPage;
            const endIndex = startIndex + this.resultsPerPage;
            const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);
            
            this.displayResults(paginatedRecipes);
            this.updatePagination();
            
            if (filteredRecipes.length === 0) {
                this.showNotification('No recipes found. Try different search terms or filters.', 'info');
            }
            
        } catch (error) {
            console.error('Search error:', error);
            this.showNotification('Error searching recipes. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Display search results
    displayResults(recipes) {
        this.searchResults.innerHTML = '';
        
        if (recipes.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No recipes found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            return;
        }
        
        recipes.forEach(recipe => {
            const recipeCard = this.createRecipeCard(recipe);
            this.searchResults.appendChild(recipeCard);
        });
    }    // Create recipe card element
    createRecipeCard(recipe) {
        const isFavorited = this.favorites.some(fav => fav.id === recipe.id);
        
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-image">
                <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/500x300/ff6b35/ffffff?text=Recipe+Image'">
                <div class="recipe-time">
                    <i class="far fa-clock"></i>
                    ${recipe.readyInMinutes} min
                </div>
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                        onclick="recipeFinder.toggleFavorite(${recipe.id})" 
                        title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-summary">${this.truncateText(recipe.summary.replace(/<[^>]*>/g, ''), 100)}</p>
                <div class="recipe-tags">
                    ${recipe.cuisines.slice(0, 2).map(cuisine => 
                        `<span class="recipe-tag">${cuisine}</span>`
                    ).join('')}
                    ${recipe.diets.slice(0, 1).map(diet => 
                        `<span class="recipe-tag">${diet}</span>`
                    ).join('')}
                </div>
                <div class="recipe-meta">
                    <span class="recipe-servings">
                        <i class="fas fa-users"></i>
                        ${recipe.servings} servings
                    </span>
                    <span class="recipe-score">
                        <i class="fas fa-star"></i>
                        ${recipe.healthScore}/100
                    </span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                this.showRecipeDetails(recipe.id);
            }
        });
        
        return card;
    }

    // Show recipe details in modal
    async showRecipeDetails(recipeId) {
        try {
            this.showLoading(true);
            
            // Find recipe in demo data
            const recipe = this.demoRecipes.find(r => r.id === recipeId);
            
            if (!recipe) {
                this.showNotification('Recipe not found', 'error');
                return;
            }
            
            await this.delay(500); // Simulate API delay
            
            this.displayRecipeModal(recipe);
            
        } catch (error) {
            console.error('Error loading recipe details:', error);
            this.showNotification('Error loading recipe details', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Display recipe in modal
    displayRecipeModal(recipe) {
        const isFavorited = this.favorites.some(fav => fav.id === recipe.id);
          this.modalBody.innerHTML = `
            <div class="recipe-detail-header">
                <h2 class="recipe-detail-title">${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-detail-image"
                     onerror="this.src='https://via.placeholder.com/500x300/ff6b35/ffffff?text=Recipe+Image'">
                <div class="recipe-detail-meta">
                    <div class="meta-item">
                        <i class="far fa-clock"></i>
                        <span>${recipe.readyInMinutes} minutes</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${recipe.servings} servings</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${recipe.healthScore}/100 health score</span>
                    </div>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                            onclick="recipeFinder.toggleFavorite(${recipe.id})" 
                            style="position: relative; margin-left: 1rem;">
                        <i class="fas fa-heart"></i>
                        ${isFavorited ? ' Remove from Favorites' : ' Add to Favorites'}
                    </button>
                </div>
            </div>
            
            <div class="recipe-detail-content">
                <div class="ingredients-section">
                    <h3><i class="fas fa-list"></i> Ingredients</h3>
                    <ul class="ingredients-list">
                        ${recipe.extendedIngredients.map(ingredient => 
                            `<li>${ingredient.original}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="instructions-section">
                    <h3><i class="fas fa-clipboard-list"></i> Instructions</h3>
                    <ol class="instructions-list">
                        ${recipe.analyzedInstructions[0]?.steps.map(step => 
                            `<li>${step.step}</li>`
                        ).join('') || '<li>Instructions not available</li>'}
                    </ol>
                </div>
            </div>
        `;
        
        this.openModal();
    }

    // Toggle favorite status
    toggleFavorite(recipeId) {
        const recipe = this.demoRecipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        const existingIndex = this.favorites.findIndex(fav => fav.id === recipeId);
        
        if (existingIndex > -1) {
            // Remove from favorites
            this.favorites.splice(existingIndex, 1);
            this.showNotification('Removed from favorites', 'success');
        } else {
            // Add to favorites
            this.favorites.push({
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                readyInMinutes: recipe.readyInMinutes,
                servings: recipe.servings,
                healthScore: recipe.healthScore
            });
            this.showNotification('Added to favorites', 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('recipeFavorites', JSON.stringify(this.favorites));
        
        // Update UI
        this.updateFavoriteButtons(recipeId);
        this.displayFavorites();
    }

    // Update favorite button states
    updateFavoriteButtons(recipeId) {
        const favoriteButtons = document.querySelectorAll(`button[onclick="recipeFinder.toggleFavorite(${recipeId})"]`);
        const isFavorited = this.favorites.some(fav => fav.id === recipeId);
        
        favoriteButtons.forEach(btn => {
            if (isFavorited) {
                btn.classList.add('favorited');
                btn.title = 'Remove from favorites';
            } else {
                btn.classList.remove('favorited');
                btn.title = 'Add to favorites';
            }
        });
    }

    // Display favorites
    displayFavorites() {
        if (this.favorites.length === 0) {
            this.favoritesContainer.innerHTML = `
                <div class="no-favorites">
                    <i class="fas fa-heart-broken"></i>
                    <p>No favorite recipes yet. Start exploring and save your favorites!</p>
                </div>
            `;
            return;
        }
        
        this.favoritesContainer.innerHTML = '';
        
        this.favorites.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';            card.innerHTML = `
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.title}"
                         onerror="this.src='https://via.placeholder.com/500x300/ff6b35/ffffff?text=Recipe+Image'">
                    <div class="recipe-time">
                        <i class="far fa-clock"></i>
                        ${recipe.readyInMinutes} min
                    </div>
                    <button class="favorite-btn favorited" 
                            onclick="recipeFinder.toggleFavorite(${recipe.id})" 
                            title="Remove from favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span class="recipe-servings">
                            <i class="fas fa-users"></i>
                            ${recipe.servings} servings
                        </span>
                        <span class="recipe-score">
                            <i class="fas fa-star"></i>
                            ${recipe.healthScore}/100
                        </span>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn')) {
                    this.showRecipeDetails(recipe.id);
                }
            });
            
            this.favoritesContainer.appendChild(card);
        });
    }

    // Pagination methods
    goToPage(page) {
        const totalPages = Math.ceil(this.totalResults / this.resultsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.performSearch();
        
        // Scroll to top of results
        this.searchResults.scrollIntoView({ behavior: 'smooth' });
    }

    updatePagination() {
        const totalPages = Math.ceil(this.totalResults / this.resultsPerPage);
        
        if (totalPages <= 1) {
            this.pagination.classList.add('hidden');
            return;
        }
        
        this.pagination.classList.remove('hidden');
        
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
        
        this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }

    // Modal methods
    openModal() {
        this.recipeModal.classList.remove('hidden');
        this.recipeModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.recipeModal.classList.remove('show');
        setTimeout(() => {
            this.recipeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Navigation handling
    handleNavigation(e) {
        e.preventDefault();
        
        // Update active nav link
        this.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Scroll to section
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Loading state
    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
            this.searchResults.style.opacity = '0.5';
        } else {
            this.loadingSpinner.classList.add('hidden');
            this.searchResults.style.opacity = '1';
        }
    }

    // Clear results
    clearResults() {
        this.searchResults.innerHTML = '';
        this.pagination.classList.add('hidden');
        this.totalResults = 0;
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Add to container
        this.notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    removeNotification(notification) {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.recipeFinder = new RecipeFinder();
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add CSS animation for notification slideOut
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .no-results {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-light);
            grid-column: 1 / -1;
        }
        
        .no-results i {
            font-size: 4rem;
            margin-bottom: 1rem;
            color: var(--light-gray);
        }
        
        .no-results h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);
});

// API Integration Guide (for when you get Spoonacular API key)
/*
To use real Spoonacular API:

1. Get API key from https://spoonacular.com/food-api
2. Replace 'demo' in this.apiKey with your actual API key
3. Replace the performSearch method with:

async performSearch() {
    this.showLoading(true);
    
    try {
        const params = new URLSearchParams({
            apiKey: this.apiKey,
            query: this.currentQuery,
            number: this.resultsPerPage,
            offset: (this.currentPage - 1) * this.resultsPerPage,
            addRecipeInformation: true,
            fillIngredients: true,
            ...this.currentFilters
        });
        
        const response = await fetch(`${this.baseUrl}/complexSearch?${params}`);
        const data = await response.json();
        
        this.totalResults = data.totalResults;
        this.displayResults(data.results);
        this.updatePagination();
        
    } catch (error) {
        console.error('Search error:', error);
        this.showNotification('Error searching recipes. Please try again.', 'error');
    } finally {
        this.showLoading(false);
    }
}

4. For recipe details, use:
const response = await fetch(`${this.baseUrl}/${recipeId}/information?apiKey=${this.apiKey}`);
*/
