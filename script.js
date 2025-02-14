let budget = 0;
let expenses = [];
let chart = null;

function setBudget() {
    const budgetInput = document.getElementById('budget-input').value;
    if (budgetInput === '' || budgetInput <= 0) {
        showAlert('Please enter a valid budget amount', 'danger');
        return;
    }
    budget = parseFloat(budgetInput);
    document.getElementById('budget-amount').textContent = `₹${budget.toFixed(2)}`;
    updateYearlyProjection();
    showAlert('Budget set successfully', 'success');
}

function addExpense() {
    const description = document.getElementById('expense-description').value;
    const amount = document.getElementById('expense-amount').value;
    const category = document.getElementById('expense-category').value;

    if (description === '' || amount === '' || amount <= 0) {
        showAlert('Please fill out all fields', 'danger');
        return;
    }

    const expense = {
        description,
        amount: parseFloat(amount),
        category
    };

    expenses.push(expense);
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';
    updateExpenses();
    updateChart();
}

function updateExpenses() {
    let totalExpenses = 0;
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '';
    expenses.forEach(expense => {
        totalExpenses += expense.amount;

        const expenseItem = `
            <div class="expense-item">
                <div class="expense-details">
                    <span>${expense.description}</span>
                    <span class="expense-category">${expense.category}</span>
                </div>
                <span>₹${expense.amount.toFixed(2)}</span>
            </div>
        `;
        expensesList.innerHTML += expenseItem;
    });

    document.getElementById('expenses-amount').textContent = `₹${totalExpenses.toFixed(2)}`;
}

function updateYearlyProjection() {
    const yearlyAmount = budget * 12;
    document.getElementById('yearly-amount').textContent = `₹${yearlyAmount.toFixed(2)}`;
}

function updateChart() {
    const categories = ['groceries', 'utilities', 'entertainment', 'transportation', 'other'];
    const categoryTotals = categories.map(cat => {
        return expenses.filter(exp => exp.category === cat)
            .reduce((sum, exp) => sum + exp.amount, 0);
    });

    const ctx = document.getElementById('expenses-chart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryTotals,
                backgroundColor: ['#f87171', '#facc15', '#34d399', '#60a5fa', '#a78bfa']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false 
            
        }
    });

    showSavingsTips();
}

function showSavingsTips() {
    const tipsContainer = document.getElementById('savings-tips');
    const savingsTipsSection = document.querySelector('.savings-tips');
    tipsContainer.innerHTML = '';

    const highestCategory = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const highestSpending = Object.entries(highestCategory)
        .sort((a, b) => b[1] - a[1])[0][0];

    const tips = {
        groceries: 'Consider buying in bulk or looking for store deals to save on groceries.',
        utilities: 'Turn off lights and unplug devices when not in use to save on utilities.',
        entertainment: 'Look for free events in your area instead of paid entertainment.',
        transportation: 'Use public transport or carpool to reduce transportation costs.',
        other: 'Review your other expenses and see if you can eliminate any non-essential items.'
    };

    if (tips[highestSpending]) {
        const tipItem = document.createElement('li');
        tipItem.innerHTML = `<i class="fas fa-lightbulb"></i> ${tips[highestSpending]}`;
        tipsContainer.appendChild(tipItem);
    }
    savingsTipsSection.style.display = tipsContainer.children.length > 0 ? 'block' : 'none';
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alert');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}
