class ExpenseTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.charts = {};
        this.editingId = null;
        
        this.initializeEventListeners();
        this.updateSummary();
        this.renderTransactions();
        this.initializeCharts();
        this.updateCharts();
        
        // Set today's date as default
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Filter changes
        document.getElementById('filterType').addEventListener('change', () => this.applyFilters());
        document.getElementById('filterCategory').addEventListener('change', () => this.applyFilters());
        document.getElementById('filterPeriod').addEventListener('change', () => this.applyFilters());

        // Action buttons
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.showDeleteModal('all'));

        // Modal events
        document.getElementById('confirmDelete').addEventListener('click', () => this.confirmDelete());
        document.getElementById('cancelDelete').addEventListener('click', () => this.hideDeleteModal());
        
        // Close modal on backdrop click
        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.hideDeleteModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideDeleteModal();
            }
        });
    }

    handleFormSubmit() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const type = document.getElementById('type').value;
        const date = document.getElementById('date').value;

        if (!description || !amount || !category || !type || !date) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (amount <= 0) {
            this.showToast('Amount must be greater than 0', 'error');
            return;
        }

        const transaction = {
            id: this.editingId || Date.now().toString(),
            description,
            amount,
            category,
            type,
            date,
            timestamp: new Date().toISOString()
        };

        if (this.editingId) {
            this.updateTransaction(transaction);
            this.editingId = null;
            document.querySelector('.btn-submit').innerHTML = '<i class="fas fa-plus"></i> Add Transaction';
            this.showToast('Transaction updated successfully!', 'success');
        } else {
            this.addTransaction(transaction);
            this.showToast('Transaction added successfully!', 'success');
        }

        this.resetForm();
        this.updateSummary();
        this.renderTransactions();
        this.updateCharts();
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveTransactions();
    }

    updateTransaction(updatedTransaction) {
        const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
            this.transactions[index] = updatedTransaction;
            this.saveTransactions();
        }
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.updateSummary();
        this.renderTransactions();
        this.updateCharts();
        this.showToast('Transaction deleted successfully!', 'success');
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        document.getElementById('description').value = transaction.description;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('category').value = transaction.category;
        document.getElementById('type').value = transaction.type;
        document.getElementById('date').value = transaction.date;

        this.editingId = id;
        document.querySelector('.btn-submit').innerHTML = '<i class="fas fa-save"></i> Update Transaction';
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        this.showToast('Editing transaction...', 'warning');
    }

    resetForm() {
        document.getElementById('transactionForm').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        this.editingId = null;
        document.querySelector('.btn-submit').innerHTML = '<i class="fas fa-plus"></i> Add Transaction';
    }

    updateSummary() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(expenses);
        document.getElementById('balance').textContent = this.formatCurrency(balance);

        // Update balance card color based on positive/negative
        const balanceCard = document.querySelector('.balance-card');
        if (balance >= 0) {
            balanceCard.querySelector('.card-icon').style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        } else {
            balanceCard.querySelector('.card-icon').style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        }
    }

    applyFilters() {
        const typeFilter = document.getElementById('filterType').value;
        const categoryFilter = document.getElementById('filterCategory').value;
        const periodFilter = document.getElementById('filterPeriod').value;

        let filtered = [...this.transactions];

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === typeFilter);
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        // Period filter
        if (periodFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(t => {
                const transactionDate = new Date(t.date);
                
                switch (periodFilter) {
                    case 'today':
                        return transactionDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                        return transactionDate >= weekStart;
                    case 'month':
                        return transactionDate.getMonth() === now.getMonth() && 
                               transactionDate.getFullYear() === now.getFullYear();
                    case 'year':
                        return transactionDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        this.renderTransactions(filtered);
        this.updateFilterStats(filtered);
    }

    updateFilterStats(filtered) {
        const count = filtered.length;
        const total = filtered.reduce((sum, t) => {
            return t.type === 'income' ? sum + t.amount : sum - t.amount;
        }, 0);

        document.getElementById('transactionCount').textContent = count;
        document.getElementById('filteredTotal').textContent = this.formatCurrency(Math.abs(total));
    }

    renderTransactions(transactionsToRender = this.transactions) {
        const container = document.getElementById('transactionList');
        
        if (transactionsToRender.length === 0) {
            container.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-inbox"></i>
                    <p>No transactions found. Try adjusting your filters!</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedTransactions = [...transactionsToRender].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sortedTransactions.map(transaction => `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-info">
                    <div class="transaction-icon ${transaction.type}">
                        ${this.getCategoryIcon(transaction.category)}
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <p>${this.getCategoryName(transaction.category)} • ${transaction.type}</p>
                    </div>
                </div>
                <div class="transaction-amount">
                    <div class="amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                    </div>
                    <div class="date">${this.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-actions">
                    <button class="btn-icon edit" onclick="expenseTracker.editTransaction('${transaction.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="expenseTracker.showDeleteModal('${transaction.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.updateFilterStats(transactionsToRender);
    }

    initializeCharts() {
        // Expense Distribution Chart
        const expenseCtx = document.getElementById('expenseChart').getContext('2d');
        this.charts.expense = new Chart(expenseCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
                        '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });

        // Monthly Trend Chart
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        this.charts.trend = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Expenses',
                    data: [],
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        this.updateExpenseChart();
        this.updateTrendChart();
    }

    updateExpenseChart() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};

        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const labels = Object.keys(categoryTotals).map(category => this.getCategoryName(category));
        const data = Object.values(categoryTotals);

        this.charts.expense.data.labels = labels;
        this.charts.expense.data.datasets[0].data = data;
        this.charts.expense.update();
    }

    updateTrendChart() {
        const monthlyData = {};
        
        this.transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expenses: 0 };
            }
            
            if (transaction.type === 'income') {
                monthlyData[monthKey].income += transaction.amount;
            } else {
                monthlyData[monthKey].expenses += transaction.amount;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const labels = sortedMonths.map(month => {
            const [year, monthNum] = month.split('-');
            const date = new Date(year, monthNum - 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });

        const incomeData = sortedMonths.map(month => monthlyData[month].income);
        const expenseData = sortedMonths.map(month => monthlyData[month].expenses);

        this.charts.trend.data.labels = labels;
        this.charts.trend.data.datasets[0].data = incomeData;
        this.charts.trend.data.datasets[1].data = expenseData;
        this.charts.trend.update();
    }

    showDeleteModal(id) {
        this.deleteId = id;
        document.getElementById('deleteModal').classList.add('show');
    }

    hideDeleteModal() {
        this.deleteId = null;
        document.getElementById('deleteModal').classList.remove('show');
    }

    confirmDelete() {
        if (this.deleteId === 'all') {
            this.transactions = [];
            this.saveTransactions();
            this.updateSummary();
            this.renderTransactions();
            this.updateCharts();
            this.showToast('All transactions cleared!', 'success');
        } else if (this.deleteId) {
            this.deleteTransaction(this.deleteId);
        }
        this.hideDeleteModal();
    }

    exportData() {
        if (this.transactions.length === 0) {
            this.showToast('No data to export!', 'warning');
            return;
        }

        const data = {
            exported_date: new Date().toISOString(),
            total_transactions: this.transactions.length,
            summary: {
                total_income: this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
                total_expenses: this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            },
            transactions: this.transactions
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully!', 'success');
    }

    getCategoryIcon(category) {
        const icons = {
            food: '🍽️',
            transport: '🚗',
            shopping: '🛍️',
            entertainment: '🎬',
            bills: '💡',
            healthcare: '🏥',
            education: '📚',
            salary: '💰',
            freelance: '💻',
            investment: '📈',
            gift: '🎁',
            other: '📝'
        };
        return icons[category] || '📝';
    }

    getCategoryName(category) {
        const names = {
            food: 'Food & Dining',
            transport: 'Transportation',
            shopping: 'Shopping',
            entertainment: 'Entertainment',
            bills: 'Bills & Utilities',
            healthcare: 'Healthcare',
            education: 'Education',
            salary: 'Salary',
            freelance: 'Freelance',
            investment: 'Investment',
            gift: 'Gift',
            other: 'Other'
        };
        return names[category] || 'Other';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    saveTransactions() {
        localStorage.setItem('expenseTrackerData', JSON.stringify(this.transactions));
    }

    loadTransactions() {
        const data = localStorage.getItem('expenseTrackerData');
        if (data) {
            return JSON.parse(data);
        }
        
        // Return sample data for demo
        return [
            {
                id: '1',
                description: 'Grocery Shopping',
                amount: 2500,
                category: 'food',
                type: 'expense',
                date: '2024-12-01',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: '2',
                description: 'Salary Credit',
                amount: 75000,
                category: 'salary',
                type: 'income',
                date: '2024-12-01',
                timestamp: '2024-12-01T09:00:00Z'
            },
            {
                id: '3',
                description: 'Movie Tickets',
                amount: 800,
                category: 'entertainment',
                type: 'expense',
                date: '2024-12-02',
                timestamp: '2024-12-02T19:00:00Z'
            },
            {
                id: '4',
                description: 'Uber Ride',
                amount: 250,
                category: 'transport',
                type: 'expense',
                date: '2024-12-03',
                timestamp: '2024-12-03T18:15:00Z'
            },
            {
                id: '5',
                description: 'Freelance Project',
                amount: 15000,
                category: 'freelance',
                type: 'income',
                date: '2024-12-04',
                timestamp: '2024-12-04T14:00:00Z'
            }
        ];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.expenseTracker = new ExpenseTracker();
});
