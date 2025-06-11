// Simple Calculator JavaScript
let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput;
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    if (operator && previousInput !== null) {
        let result;
        let prev = parseFloat(previousInput);
        let current = parseFloat(currentInput);
        
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        operator = null;
        previousInput = null;
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Handle operator buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('operator') && !e.target.classList.contains('equals')) {
        if (operator && previousInput !== null && !shouldResetDisplay) {
            calculate();
        }
        
        operator = e.target.textContent;
        if (operator === '×') operator = '*';
        if (operator === '÷') operator = '/';
        
        previousInput = currentInput;
        shouldResetDisplay = true;
    }
});

// Keyboard support
document.addEventListener('keydown', function(e) {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        if (currentInput.indexOf('.') === -1) {
            appendToDisplay(key);
        }
    } else if (key === '+' || key === '-') {
        if (operator && previousInput !== null && !shouldResetDisplay) {
            calculate();
        }
        operator = key;
        previousInput = currentInput;
        shouldResetDisplay = true;
    } else if (key === '*' || key === '/') {
        if (operator && previousInput !== null && !shouldResetDisplay) {
            calculate();
        }
        operator = key;
        previousInput = currentInput;
        shouldResetDisplay = true;
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearAll();
    } else if (key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    }
});

// Initialize display
window.onload = function() {
    updateDisplay();
};
