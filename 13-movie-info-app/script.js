// TMDB API Configuration
const API_KEY = 'bc4e4fff428e33eca2eb81af6eb22cb3';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Global variables
let currentPage = 1;
let totalPages = 1;
let currentQuery = '';
let currentSort = 'popularity.desc';
let currentGenre = '';
let genres = {};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortBy');
const genreSelect = document.getElementById('genreFilter');
const moviesContainer = document.getElementById('moviesContainer');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const movieModal = document.getElementById('movieModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadGenres();
    loadPopularMovies();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        currentPage = 1;
        if (currentQuery) {
            searchMovies(currentQuery);
        } else {
            loadMovies();
        }
    });

    genreSelect.addEventListener('change', function() {
        currentGenre = this.value;
        currentPage = 1;
        if (currentQuery) {
            searchMovies(currentQuery);
        } else {
            loadMovies();
        }
    });

    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            if (currentQuery) {
                searchMovies(currentQuery);
            } else {
                loadMovies();
            }
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            if (currentQuery) {
                searchMovies(currentQuery);
            } else {
                loadMovies();
            }
        }
    });

    closeModal.addEventListener('click', closeMovieModal);
    movieModal.addEventListener('click', function(e) {
        if (e.target === movieModal) {
            closeMovieModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMovieModal();
        }
    });
}

// API Functions
async function apiRequest(endpoint) {
    try {
        showLoading();
        const response = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        hideLoading();
        return data;
    } catch (err) {
        hideLoading();
        showError(`Failed to fetch data: ${err.message}`);
        throw err;
    }
}

async function loadGenres() {
    try {
        const data = await apiRequest('/genre/movie/list');
        genres = {};
        data.genres.forEach(genre => {
            genres[genre.id] = genre.name;
        });
        
        // Populate genre filter
        genreSelect.innerHTML = '<option value="">All Genres</option>';
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Failed to load genres:', err);
    }
}

async function loadPopularMovies() {
    currentQuery = '';
    currentPage = 1;
    await loadMovies();
}

async function loadMovies() {
    let endpoint = `/discover/movie?sort_by=${currentSort}&page=${currentPage}`;
    
    if (currentGenre) {
        endpoint += `&with_genres=${currentGenre}`;
    }
    
    try {
        const data = await apiRequest(endpoint);
        displayMovies(data.results);
        updatePagination(data.page, data.total_pages);
    } catch (err) {
        console.error('Failed to load movies:', err);
    }
}

async function searchMovies(query) {
    if (!query.trim()) {
        loadPopularMovies();
        return;
    }
    
    let endpoint = `/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`;
    
    try {
        let data = await apiRequest(endpoint);
        
        // Filter by genre if selected
        if (currentGenre) {
            data.results = data.results.filter(movie => 
                movie.genre_ids && movie.genre_ids.includes(parseInt(currentGenre))
            );
        }
        
        // Sort results
        if (currentSort === 'popularity.desc') {
            data.results.sort((a, b) => b.popularity - a.popularity);
        } else if (currentSort === 'release_date.desc') {
            data.results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        } else if (currentSort === 'vote_average.desc') {
            data.results.sort((a, b) => b.vote_average - a.vote_average);
        } else if (currentSort === 'title.asc') {
            data.results.sort((a, b) => a.title.localeCompare(b.title));
        }
        
        displayMovies(data.results);
        updatePagination(data.page, data.total_pages);
    } catch (err) {
        console.error('Failed to search movies:', err);
    }
}

async function getMovieDetails(movieId) {
    try {
        const movie = await apiRequest(`/movie/${movieId}?append_to_response=credits,videos`);
        displayMovieModal(movie);
    } catch (err) {
        console.error('Failed to get movie details:', err);
        showError('Failed to load movie details');
    }
}

// Display Functions
function displayMovies(movies) {
    hideError();
    
    if (!movies || movies.length === 0) {
        moviesContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: white; padding: 40px;">
                <i class="fas fa-film" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No movies found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    moviesContainer.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="getMovieDetails(${movie.id})">
            ${movie.poster_path 
                ? `<img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">` 
                : '<div class="no-poster"><i class="fas fa-image"></i></div>'
            }
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-overview">${movie.overview || 'No overview available.'}</p>
                <div class="movie-meta">
                    <div class="movie-rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div class="movie-date">
                        ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayMovieModal(movie) {
    const backdropUrl = movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : '';
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '';
    
    // Generate star rating
    const rating = movie.vote_average;
    const stars = Math.round(rating / 2);
    const starRating = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    
    // Format runtime
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown';
    
    // Format release date
    const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Unknown';
    
    // Get director from credits
    const director = movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown';
    
    // Get main cast (first 5)
    const cast = movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'Not available';
    
    modalBody.innerHTML = `
        <div class="modal-header">
            ${backdropUrl ? `<img src="${backdropUrl}" alt="${movie.title}" class="modal-backdrop">` : ''}
            ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" class="modal-poster">` : ''}
        </div>
        
        <h2 class="modal-title">${movie.title}</h2>
        ${movie.tagline ? `<p class="modal-tagline">"${movie.tagline}"</p>` : ''}
        
        <div class="modal-meta">
            <div class="meta-item">
                <span class="meta-label">Rating</span>
                <div class="meta-value">
                    <span class="rating-stars">${starRating}</span>
                    <span>${rating ? rating.toFixed(1) : 'N/A'}/10</span>
                </div>
            </div>
            <div class="meta-item">
                <span class="meta-label">Release Date</span>
                <span class="meta-value">${releaseDate}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Runtime</span>
                <span class="meta-value">${runtime}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Director</span>
                <span class="meta-value">${director}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Budget</span>
                <span class="meta-value">${movie.budget ? `$${movie.budget.toLocaleString()}` : 'Unknown'}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Revenue</span>
                <span class="meta-value">${movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'Unknown'}</span>
            </div>
        </div>
        
        ${movie.genres?.length ? `
            <div class="genres">
                ${movie.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
            </div>
        ` : ''}
        
        <div class="modal-overview">
            <h3 style="margin-bottom: 15px; color: #333;">Overview</h3>
            <p>${movie.overview || 'No overview available.'}</p>
        </div>
        
        <div class="modal-overview">
            <h3 style="margin-bottom: 15px; color: #333;">Cast</h3>
            <p>${cast}</p>
        </div>
    `;
    
    movieModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeMovieModal() {
    movieModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updatePagination(page, total) {
    currentPage = page;
    totalPages = total;
    
    pageInfo.textContent = `Page ${page} of ${total}`;
    prevPageBtn.disabled = page <= 1;
    nextPageBtn.disabled = page >= total;
}

// Search Handler
function handleSearch() {
    const query = searchInput.value.trim();
    currentQuery = query;
    currentPage = 1;
    
    if (query) {
        searchMovies(query);
    } else {
        loadPopularMovies();
    }
}

// Utility Functions
function showLoading() {
    loading.style.display = 'block';
    error.style.display = 'none';
    moviesContainer.innerHTML = '';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    error.style.display = 'block';
    errorMessage.textContent = message;
    loading.style.display = 'none';
    moviesContainer.innerHTML = '';
}

function hideError() {
    error.style.display = 'none';
}

// Add some sample searches for better UX
searchInput.addEventListener('focus', function() {
    if (!this.value) {
        this.placeholder = 'Try "Avengers", "Spider-Man", "The Matrix"...';
    }
});

searchInput.addEventListener('blur', function() {
    if (!this.value) {
        this.placeholder = 'Search for movies...';
    }
});

// Add keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    if (movieModal.style.display === 'block') {
        if (e.key === 'ArrowLeft' && !prevPageBtn.disabled) {
            prevPageBtn.click();
        } else if (e.key === 'ArrowRight' && !nextPageBtn.disabled) {
            nextPageBtn.click();
        }
    }
});

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
