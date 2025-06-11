// StreamFlix Landing Page - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('StreamFlix JavaScript loaded successfully!');

    // Header scroll effect
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            } else {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }
        });
    }

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (question && answer && icon) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    const faqIcon = faqItem.querySelector('.faq-icon');
                    if (faqAnswer) faqAnswer.style.maxHeight = null;
                    if (faqIcon) faqIcon.style.transform = 'rotate(0deg)';
                });
                
                // If the clicked item wasn't active, open it
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(45deg)';
                }
            });
        }
    });

    // Modal functionality
    const modal = document.getElementById('loginModal');
    const signInBtn = document.getElementById('signInBtn');
    const closeBtn = document.querySelector('.close');
    
    if (signInBtn && modal) {
        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Email signup forms handling
    const signupForms = document.querySelectorAll('.signup-form');
    
    signupForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            
            if (emailInput) {
                const email = emailInput.value.trim();
                
                if (!email) {
                    showNotification('Please enter your email address', 'error');
                    emailInput.focus();
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    emailInput.focus();
                    return;
                }
                
                // Simulate successful signup
                showNotification('Thank you! We\'ll send you information about StreamFlix.', 'success');
                emailInput.value = '';
            }
        });
    });

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            
            if (!emailInput || !passwordInput) {
                showNotification('Form elements not found', 'error');
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', 'error');
                return;
            }
            
            // Simulate login process
            showNotification('Login successful! Welcome to StreamFlix!', 'success');
            
            setTimeout(() => {
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                // Reset form
                loginForm.reset();
            }, 2000);
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: Arial, sans-serif;
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        if (notificationContent) {
            notificationContent.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            `;
        }
        
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            `;
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Manual close
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                clearTimeout(autoRemove);
                removeNotification(notification);
            });
        }
    }
    
    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('input');
    
    formInputs.forEach(input => {
        // Add focus and blur effects
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.classList.add('focused');
            }
        });
        
        input.addEventListener('blur', function() {
            if (!this.value.trim() && this.parentElement) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Real-time validation for email inputs
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                const email = this.value.trim();
                if (email && !isValidEmail(email)) {
                    this.style.borderColor = '#f44336';
                } else {
                    this.style.borderColor = '#333';
                }
            });
        }
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe feature sections and FAQ items for animation
    const animatedElements = document.querySelectorAll('.feature, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Language selector functionality
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            showNotification(`Language changed to ${selectedLanguage === 'hi' ? 'हिन्दी' : 'English'}`, 'info');
        });
    }

    console.log('All JavaScript features initialized successfully!');
});
