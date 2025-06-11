// Modern Blog UI - Enhanced JavaScript
// A clean, responsive blog interface with authentication, filtering, search, and modal functionality

class BlogUI {
    constructor() {
        this.currentUser = null;
        this.blogData = null;
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentPost = null;
        
        this.init();
    }    async init() {
        await this.loadData();
        this.loadLocalData(); // Load any local changes
        this.loadUserFromLocalStorage();
        this.bindEvents();
        this.setupTheme();
        this.renderBlogPosts();
        this.hideLoading();
    }async loadData() {
        try {
            // Load data from JSON file
            const response = await fetch('./data.json');
            this.blogData = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback data if JSON file fails to load
            this.blogData = {
                users: [],
                blogPosts: [],
                likes: {},
                comments: {}
            };
        }
    }

    // Google Authentication Functions
    handleCredentialResponse(response) {
        // In a real app, verify the token on the server
        const userData = this.parseJwt(response.credential);
        this.currentUser = {
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            picture: userData.picture
        };
        
        this.updateUserInterface();
        this.saveUserToLocalStorage();
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    updateUserInterface() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            loginBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            userAvatar.src = this.currentUser.picture;
            userName.textContent = this.currentUser.name;
        } else {
            loginBtn.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }

    saveUserToLocalStorage() {
        if (this.currentUser) {
            localStorage.setItem('blogUser', JSON.stringify(this.currentUser));
        }
    }

    loadUserFromLocalStorage() {
        const savedUser = localStorage.getItem('blogUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUserInterface();
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('blogUser');
        this.updateUserInterface();
    }

    // Blog Writing Functions
    openWriteBlogModal() {
        if (!this.currentUser) {
            alert('Please login to write a blog post');
            return;
        }
        document.getElementById('writeBlogModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeWriteBlogModal() {
        document.getElementById('writeBlogModal').classList.remove('active');
        document.body.style.overflow = 'auto';
        this.clearBlogForm();
    }

    clearBlogForm() {
        document.getElementById('blogTitle').value = '';
        document.getElementById('blogExcerpt').value = '';
        document.getElementById('blogCategory').value = 'javascript';
        document.getElementById('blogImage').value = '';
        document.getElementById('blogContent').value = '';
    }

    publishBlog() {
        if (!this.currentUser) {
            alert('Please login to publish a blog post');
            return;
        }

        const title = document.getElementById('blogTitle').value.trim();
        const excerpt = document.getElementById('blogExcerpt').value.trim();
        const category = document.getElementById('blogCategory').value;
        const image = document.getElementById('blogImage').value.trim();
        const content = document.getElementById('blogContent').value.trim();

        if (!title || !excerpt || !content) {
            alert('Please fill in all required fields');
            return;
        }        const newPost = {
            id: Date.now(),
            title,
            excerpt,
            content,
            category,
            author: this.currentUser.name,
            authorEmail: this.currentUser.email,
            date: new Date().toISOString().split('T')[0],
            readTime: Math.max(1, Math.ceil(content.split(' ').length / 200)),
            likes: 0,
            comments: 0,
            image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=300&fit=crop&q=80',
            likedBy: [],
            commentsList: []
        };

        this.blogData.blogPosts.unshift(newPost);
        this.saveData(); // Save the new blog post to localStorage
        this.closeWriteBlogModal();
        this.renderBlogPosts();
        
        alert('Blog published successfully!');
    }

    // Like and Comment Functions
    toggleLike(postId) {
        if (!this.currentUser) {
            alert('Please login to like posts');
            return;
        }

        const post = this.blogData.blogPosts.find(p => p.id === postId);
        if (!post) return;

        const userIndex = post.likedBy.indexOf(this.currentUser.email);
        
        if (userIndex > -1) {
            post.likedBy.splice(userIndex, 1);
            post.likes--;
        } else {
            post.likedBy.push(this.currentUser.email);
            post.likes++;
        }

        // Save changes to localStorage
        this.saveData();
        
        this.renderBlogPosts();
        if (this.currentPost && this.currentPost.id === postId) {
            this.updateModalLikeButton(post);
        }
    }

    updateModalLikeButton(post) {
        const likeBtn = document.getElementById('modalLikeBtn');
        const likeCount = likeBtn.querySelector('.like-count');
        
        likeCount.textContent = post.likes;
        
        if (this.currentUser && post.likedBy.includes(this.currentUser.email)) {
            likeBtn.classList.add('liked');
        } else {
            likeBtn.classList.remove('liked');
        }
    }

    addComment(postId, content) {
        if (!this.currentUser) {
            alert('Please login to comment');
            return;
        }

        if (!content.trim()) {
            alert('Please enter a comment');
            return;
        }

        const post = this.blogData.blogPosts.find(p => p.id === postId);
        if (!post) return;

        const newComment = {
            id: `c${Date.now()}`,
            author: this.currentUser.name,
            content: content.trim(),
            date: new Date().toISOString().split('T')[0],
            avatar: this.currentUser.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        };        post.commentsList.unshift(newComment);
        post.comments++;
        
        // Save changes to localStorage
        this.saveData();
        
        this.renderComments(post);
        this.renderBlogPosts();
        
        // Clear comment input
        document.getElementById('commentInput').value = '';
    }

    renderComments(post) {
        const commentsList = document.getElementById('commentsList');
        const commentCount = document.querySelector('#showCommentsBtn .comment-count');
        
        commentCount.textContent = post.comments;
        
        if (post.commentsList.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No comments yet. Be the first to comment!</p>';
            return;
        }

        commentsList.innerHTML = post.commentsList.map(comment => `
            <div class="comment-item">
                <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-date">${this.formatDate(comment.date)}</div>
                </div>
            </div>
        `).join('');
    }

    // Content Generation Function
    generateFullContent(title, category) {
        const contents = {
            javascript: `
                <h1>${title}</h1>
                <p>India's tech landscape is evolving rapidly, and modern JavaScript is at the forefront of this digital revolution. From startups in Bangalore to established companies in Pune, developers are embracing ES6+ features to build scalable applications.</p>
                
                <h2>Key Benefits for Indian Developers</h2>
                <ul>
                    <li><strong>Better Performance:</strong> Modern JavaScript engines provide significant improvements</li>
                    <li><strong>Cleaner Code:</strong> ES6+ syntax makes code more readable and maintainable</li>
                    <li><strong>Career Growth:</strong> Companies actively seek developers with modern JavaScript skills</li>
                    <li><strong>Global Opportunities:</strong> Opens doors to international remote work</li>
                </ul>
                
                <h2>Salary Expectations in India</h2>
                <p>With modern JavaScript skills, developers can expect:</p>
                <ul>
                    <li><strong>Fresher (0-2 years):</strong> ₹3-8 LPA</li>
                    <li><strong>Mid-level (2-5 years):</strong> ₹8-20 LPA</li>
                    <li><strong>Senior (5+ years):</strong> ₹20-50 LPA</li>
                    <li><strong>Architect/Lead:</strong> ₹50+ LPA</li>
                </ul>
                
                <p>These numbers are higher in tech hubs like Bangalore, Mumbai, and Hyderabad.</p>
            `,
            css: `
                <h1>${title}</h1>
                <p>Building responsive e-commerce platforms for India's diverse market requires understanding both technical excellence and user behavior across different regions and devices.</p>
                
                <h2>CSS Grid for Indian E-commerce</h2>
                <p>Perfect for creating flexible product layouts that work from Delhi to Dharamshala.</p>
                
                <h2>Mobile-First for Bharat</h2>
                <p>With mobile internet users growing rapidly in tier-2 and tier-3 cities, mobile-first design is crucial for Indian e-commerce success.</p>
            `,
            react: `
                <h1>${title}</h1>
                <p>React has become the go-to framework for Indian startups building scalable web applications. Companies like Flipkart, Paytm, and Zomato use React to serve millions of users daily.</p>
                
                <h2>Why React Works for Indian Startups</h2>
                <ul>
                    <li><strong>Rapid Development:</strong> Perfect for India's fast-paced startup environment</li>
                    <li><strong>Community Support:</strong> Active React communities in Bangalore, Mumbai, Delhi</li>
                    <li><strong>Talent Availability:</strong> Large pool of React developers in India</li>
                </ul>
            `,
            tutorials: `
                <h1>${title}</h1>
                <p>The web development industry in India is booming, with opportunities in every major city. This comprehensive guide will help you navigate your journey from learning to landing your first job.</p>
                
                <h2>Learning Path for Indian Developers</h2>
                <ol>
                    <li><strong>HTML/CSS Basics:</strong> 2-3 months</li>
                    <li><strong>JavaScript Fundamentals:</strong> 3-4 months</li>
                    <li><strong>React/Framework:</strong> 2-3 months</li>
                    <li><strong>Backend Basics:</strong> 2-3 months</li>
                    <li><strong>Projects & Portfolio:</strong> 2-3 months</li>
                </ol>
                
                <h2>Job Market in India</h2>
                <p>Tech hubs across India offer excellent opportunities for web developers:</p>
                <ul>
                    <li><strong>Bangalore:</strong> Startup capital with highest opportunities</li>
                    <li><strong>Mumbai:</strong> Fintech and enterprise solutions</li>
                    <li><strong>Pune:</strong> IT services and product companies</li>
                    <li><strong>Hyderabad:</strong> Global tech companies and startups</li>
                    <li><strong>Chennai:</strong> Growing tech ecosystem</li>
                </ul>
            `
        };
        
        return contents[category] || contents.tutorials;
    }

    // Existing functions (search, filter, modal, theme) remain the same...
    bindEvents() {
        // Authentication events
        document.getElementById('loginBtn').addEventListener('click', () => {
            // For demo purposes, simulate Google login
            this.simulateGoogleLogin();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Write blog events
        document.getElementById('writeBlogBtn').addEventListener('click', () => {
            this.openWriteBlogModal();
        });

        document.getElementById('writeBlogClose').addEventListener('click', () => {
            this.closeWriteBlogModal();
        });

        document.getElementById('writeBlogOverlay').addEventListener('click', () => {
            this.closeWriteBlogModal();
        });

        document.getElementById('cancelBlogBtn').addEventListener('click', () => {
            this.closeWriteBlogModal();
        });        document.getElementById('publishBlogBtn').addEventListener('click', () => {
            this.publishBlog();
        });

        // Modal delete button
        document.getElementById('modalDeleteBtn').addEventListener('click', () => {
            if (this.currentPost) {
                this.deleteBlog(this.currentPost.id);
            }
        });

        // Comment events
        document.getElementById('submitCommentBtn').addEventListener('click', () => {
            const content = document.getElementById('commentInput').value;
            if (this.currentPost) {
                this.addComment(this.currentPost.id, content);
            }
        });

        // Existing events...
        this.bindSearchEvents();
        this.bindFilterEvents();
        this.bindModalEvents();
        this.bindThemeEvents();
        this.bindScrollEvents();
    }

    // Demo function to simulate Google login
    simulateGoogleLogin() {
        // Simulate Google user data
        this.currentUser = {
            id: 'demo_user_123',
            name: 'Demo User',
            email: 'demo@example.com',
            picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        };
        
        this.updateUserInterface();
        this.saveUserToLocalStorage();
        alert('Demo login successful! In production, this would use Google OAuth.');
    }

    bindSearchEvents() {
        const searchToggle = document.getElementById('searchToggle');
        const searchBar = document.getElementById('searchBar');
        const searchInput = document.getElementById('searchInput');
        const searchClose = document.getElementById('searchClose');

        searchToggle.addEventListener('click', () => {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                this.currentSearch = '';
                this.renderBlogPosts();
            }
        });

        searchClose.addEventListener('click', () => {
            searchBar.classList.remove('active');
            searchInput.value = '';
            this.currentSearch = '';
            this.renderBlogPosts();
        });

        searchInput.addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.renderBlogPosts();
        });
    }

    bindFilterEvents() {
        const filterLinks = document.querySelectorAll('.nav-link, .filter-tab');
        
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = link.dataset.filter;
                
                if (filter) {
                    this.currentFilter = filter;
                    this.currentPage = 1;
                    
                    // Update active states
                    document.querySelectorAll('.nav-link, .filter-tab').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    this.renderBlogPosts();
                }
            });
        });
    }

    bindModalEvents() {
        const modal = document.getElementById('articleModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        modalClose.addEventListener('click', () => this.closeModal());
        modalOverlay.addEventListener('click', () => this.closeModal());

        // Modal like button
        document.getElementById('modalLikeBtn').addEventListener('click', () => {
            if (this.currentPost) {
                this.toggleLike(this.currentPost.id);
            }
        });

        // Show/hide comments
        document.getElementById('showCommentsBtn').addEventListener('click', () => {
            const commentsSection = document.getElementById('commentsSection');
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        });
    }

    bindThemeEvents() {
        const themeToggle = document.getElementById('themeToggle');
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    bindScrollEvents() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        loadMoreBtn.addEventListener('click', () => {
            this.loadMorePosts();
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('blogTheme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('blogTheme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    getFilteredPosts() {
        let filteredPosts = this.blogData.blogPosts;

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === this.currentFilter);
        }

        // Apply search filter
        if (this.currentSearch) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(this.currentSearch) ||
                post.excerpt.toLowerCase().includes(this.currentSearch) ||
                post.author.toLowerCase().includes(this.currentSearch) ||
                post.category.toLowerCase().includes(this.currentSearch)
            );
        }

        return filteredPosts;
    }

    renderBlogPosts() {
        const container = document.getElementById('blogContainer');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (!container) return;

        const filteredPosts = this.getFilteredPosts();
        const startIndex = 0;
        const endIndex = this.currentPage * this.postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        if (postsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            loadMoreBtn.style.display = 'none';
            return;
        }

        container.innerHTML = postsToShow.map(post => this.createBlogCard(post)).join('');
        
        // Show/hide load more button
        loadMoreBtn.style.display = endIndex >= filteredPosts.length ? 'none' : 'block';
    }    createBlogCard(post) {
        const isLiked = this.currentUser && post.likedBy.includes(this.currentUser.email);
        const canDelete = this.currentUser && (post.authorEmail === this.currentUser.email || post.author === this.currentUser.name);
          return `
            <article class="blog-card" data-category="${post.category}">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="blog-category">${post.category}</div>
                    ${canDelete ? `<button class="delete-post-btn" onclick="blogUI.deleteBlog(${post.id})" title="Delete Post"><i class="fas fa-trash"></i></button>` : ''}
                </div>                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="author-info">
                            <i class="fas fa-user"></i>
                            ${post.author}
                        </span>
                        <span class="publish-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(post.date)}
                        </span>
                        <span class="read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime} min read
                        </span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-meta">
                        <div class="blog-actions">
                            <button class="blog-action-btn ${isLiked ? 'liked' : ''}" onclick="blogUI.toggleLike(${post.id})">
                                <i class="fas fa-heart"></i>
                                <span>${post.likes}</span>
                            </button>
                            <button class="blog-action-btn">
                                <i class="fas fa-comment"></i>
                                <span>${post.comments}</span>
                            </button>
                        </div>
                        <button class="read-more-btn" onclick="blogUI.openModal(${post.id})">
                            Read More
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }    openModal(postId) {
        const post = this.blogData.blogPosts.find(p => p.id === postId);
        if (!post) return;

        this.currentPost = post;
        const modal = document.getElementById('articleModal');
        const modalContent = document.getElementById('modalContent');
        const modalDeleteBtn = document.getElementById('modalDeleteBtn');
        
        modalContent.innerHTML = post.content;
        
        // Update like button
        this.updateModalLikeButton(post);
        
        // Update comments
        this.renderComments(post);
        
        // Show/hide delete button based on ownership
        const canDelete = this.currentUser && (post.authorEmail === this.currentUser.email || post.author === this.currentUser.name);
        modalDeleteBtn.style.display = canDelete ? 'inline-flex' : 'none';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('articleModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.currentPost = null;
    }

    loadMorePosts() {
        this.currentPage++;
        this.renderBlogPosts();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // Save data to localStorage (since we can't write to JSON file from frontend)
    saveData() {
        try {
            localStorage.setItem('blogData', JSON.stringify(this.blogData));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Load data from localStorage if available
    loadLocalData() {
        try {
            const savedData = localStorage.getItem('blogData');
            if (savedData) {
                const localData = JSON.parse(savedData);
                // Merge with existing data, prioritizing local changes
                this.blogData.blogPosts = localData.blogPosts || this.blogData.blogPosts;
                this.blogData.users = localData.users || this.blogData.users;
            }
        } catch (error) {
            console.error('Error loading local data:', error);
        }
    }

    // Delete blog post (only if user is the author)
    deleteBlog(postId) {
        if (!this.currentUser) {
            alert('Please login to delete posts');
            return;
        }

        const post = this.blogData.blogPosts.find(p => p.id === postId);
        if (!post) {
            alert('Post not found');
            return;
        }

        // Check if current user is the author
        if (post.authorEmail !== this.currentUser.email && post.author !== this.currentUser.name) {
            alert('You can only delete your own posts');
            return;
        }

        if (confirm('Are you sure you want to delete this blog post?')) {
            // Remove post from array
            this.blogData.blogPosts = this.blogData.blogPosts.filter(p => p.id !== postId);
            
            // Save to localStorage
            this.saveData();
            
            // Re-render posts
            this.renderBlogPosts();
            
            // Close modal if it's open
            this.closeModal();
            
            alert('Blog post deleted successfully!');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogUI = new BlogUI();
});
