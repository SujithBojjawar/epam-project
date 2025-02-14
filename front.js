let expenses = [];
let chart;
function setBudget() {
    const budgetInput = document.getElementById('budget-input').value;
    if (budgetInput > 0) {
        document.getElementById('budget-amount').textContent = parseFloat(budgetInput).toFixed(2);
        showAlert('Budget set successfully', 'success');
    } else {
        showAlert('Please enter a valid budget amount', 'danger');
    }
}
function addExpenseRow() {
    const tableBody = document.getElementById('expense-tbody');
    const row = `
        <tr>
            <td><input type="text" placeholder="Description" class="expense-description"></td>
            <td><input type="number" placeholder="Amount" class="expense-amount"></td>
            <td>
                <select class="expense-category">
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                </select>
            </td>
            <td><button class="btn-remove-row" onclick="removeExpenseRow(this)">Remove</button></td>
        </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
}

function removeExpenseRow(button) {
    button.parentElement.parentElement.remove();
}

function submitExpenses() {
    const descriptions = document.querySelectorAll('.expense-description');
    const amounts = document.querySelectorAll('.expense-amount');
    const categories = document.querySelectorAll('.expense-category');
    expenses = [];
    for (let i = 0; i < descriptions.length; i++) {
        const description = descriptions[i].value;
        const amount = parseFloat(amounts[i].value);
        const category = categories[i].value;

        if (description && amount > 0) {
            expenses.push({ description, amount, category });
        }
    }
    if (expenses.length === 0) {
        showAlert('Please add valid expenses', 'danger');
        return;
    }

    updateExpenses();
    showAlert('Expenses submitted successfully', 'success');
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
        expensesList.insertAdjacentHTML('beforeend', expenseItem);
    });

    document.getElementById('expenses-amount').textContent = totalExpenses.toFixed(2);
    updateYearlyProjection();
    updateChart();
}

function updateYearlyProjection() {
    const yearlyAmount = (parseFloat(document.getElementById('expenses-amount').textContent) * 12).toFixed(2);
    document.getElementById('yearly-amount').textContent = yearlyAmount;
}
function updateChart() {
    const categories = {};
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    const chartLabels = Object.keys(categories);
    const chartData = Object.values(categories);

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('expenses-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Expenses',
                data: chartData,
                backgroundColor: ['#2563eb', '#f87171', '#34d399', '#fbbf24', '#a78bfa']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'right',
                    align: 'center',
                    labels: {
                        boxWidth: 15,
                        padding: 15
                    }
                }
            }
        }
    });
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
document.addEventListener('DOMContentLoaded', () => {
    addExpenseRow();
});
