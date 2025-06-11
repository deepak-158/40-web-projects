// Todo List App - actually use this myself now!
// Way more complex than I thought it would be, but really useful

class TodoApp {
    constructor() {
        this.tasks = this.loadTasks(); // load from localStorage if available
        this.currentFilter = 'all'; // show all tasks by default
        this.currentSearch = '';
        
        this.initializeElements();
        this.attachEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        this.addTaskForm = document.getElementById('addTaskForm');
        this.taskInput = document.getElementById('taskInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        // Stats elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
    }    attachEventListeners() {
        this.addTaskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        
        // filter buttons for showing all/active/completed tasks
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Keyboard shortcut - Ctrl+Enter to focus input (pretty handy!)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.taskInput.focus();
            }
        });
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const text = this.taskInput.value.trim();
        if (!text) return;
        
        const task = {
            id: Date.now(),
            text: text,
            category: this.categorySelect.value,
            priority: this.prioritySelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        // Reset form
        this.taskInput.value = '';
        this.categorySelect.value = 'personal';
        this.prioritySelect.value = 'medium';
        
        // Show success feedback
        this.showFeedback('Task added successfully!');
    }

    handleSearch(e) {
        this.currentSearch = e.target.value.toLowerCase();
        this.renderTasks();
    }

    handleFilter(e) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    editTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
            this.renderTasks();
            this.showFeedback('Task updated!');
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showFeedback('Task deleted!');
        }
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showFeedback('No completed tasks to clear!');
            return;
        }
        
        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showFeedback('Completed tasks cleared!');
        }
    }

    clearAll() {
        if (this.tasks.length === 0) {
            this.showFeedback('No tasks to clear!');
            return;
        }
        
        if (confirm('Delete all tasks? This action cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showFeedback('All tasks cleared!');
        }
    }

    getFilteredTasks() {
        let filtered = this.tasks;
        
        // Apply search filter
        if (this.currentSearch) {
            filtered = filtered.filter(task => 
                task.text.toLowerCase().includes(this.currentSearch)
            );
        }
        
        // Apply status filter
        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(task => !task.completed);
                break;
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
            // 'all' shows everything
        }
        
        return filtered;
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.tasksList.style.display = 'none';
            this.emptyState.style.display = 'block';
            
            if (this.tasks.length === 0) {
                this.emptyState.innerHTML = `
                    <div class="empty-icon">📝</div>
                    <h3>No tasks yet</h3>
                    <p>Add a task to get started!</p>
                `;
            } else {
                this.emptyState.innerHTML = `
                    <div class="empty-icon">🔍</div>
                    <h3>No tasks found</h3>
                    <p>Try adjusting your search or filter.</p>
                `;
            }
            return;
        }
        
        this.tasksList.style.display = 'block';
        this.emptyState.style.display = 'none';
        
        this.tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
        
        // Attach event listeners to task elements
        this.attachTaskEventListeners();
    }

    createTaskHTML(task) {
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-text" contenteditable="false">${task.text}</div>
                    <div class="task-meta">
                        <span class="task-category ${task.category}">${task.category}</span>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                        <span class="task-date">${this.formatDate(task.createdAt)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit-btn" title="Edit task">✏️</button>
                    <button class="task-action-btn delete-btn" title="Delete task">🗑️</button>
                </div>
            </div>
        `;
    }

    attachTaskEventListeners() {
        // Checkbox listeners
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.toggleTask(taskId);
            });
        });
        
        // Edit button listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskItem = e.target.closest('.task-item');
                const taskId = parseInt(taskItem.dataset.id);
                const taskText = taskItem.querySelector('.task-text');
                
                this.startEditing(taskText, taskId);
            });
        });
        
        // Delete button listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.deleteTask(taskId);
            });
        });
        
        // Task text click listeners
        document.querySelectorAll('.task-text').forEach(text => {
            text.addEventListener('dblclick', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.startEditing(e.target, taskId);
            });
        });
    }

    startEditing(textElement, taskId) {
        const originalText = textElement.textContent;
        textElement.contentEditable = true;
        textElement.classList.add('editing');
        textElement.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(textElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        const finishEditing = () => {
            textElement.contentEditable = false;
            textElement.classList.remove('editing');
            
            const newText = textElement.textContent;
            if (newText !== originalText && newText.trim()) {
                this.editTask(taskId, newText);
            } else {
                textElement.textContent = originalText;
            }
        };
        
        textElement.addEventListener('blur', finishEditing, { once: true });
        textElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                textElement.blur();
            }
            if (e.key === 'Escape') {
                textElement.textContent = originalText;
                textElement.blur();
            }
        }, { once: true });
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    }

    showFeedback(message) {
        // Create or update feedback element
        let feedback = document.querySelector('.feedback-toast');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'feedback-toast';
            feedback.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 1000;
            `;
            document.body.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            feedback.style.transform = 'translateX(400px)';
        }, 3000);
    }

    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }
}

// Initialize the app
const todoApp = new TodoApp();

// Add some helpful tips
document.addEventListener('DOMContentLoaded', () => {
    // Show tip about shortcuts
    setTimeout(() => {
        if (localStorage.getItem('todoTipShown') !== 'true') {
            todoApp.showFeedback('Tip: Double-click task text to edit, Ctrl+Enter to focus input!');
            localStorage.setItem('todoTipShown', 'true');
        }
    }, 2000);
});
