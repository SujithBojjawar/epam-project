// Get expenses data from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Initialize charts
let comparisonChart;

document.addEventListener('DOMContentLoaded', () => {
    initializeInsights();
    updateGoalsList();
    generateRecommendations();
    updateComparisonChart();
});

function initializeInsights() {
    analyzeSpendingTrends();
    updateBudgetProgress();
    generateAIInsights();
    updateTimeline();
    updateCategoryOptimization();
}

function analyzeSpendingTrends() {
    const trend = calculateSpendingTrend();
    const trendElement = document.getElementById('spending-trend');
    
    trendElement.textContent = trend.message;
    trendElement.className = `value ${trend.type}`;
}

function calculateSpendingTrend() {
    if (expenses.length < 2) {
        return { message: 'Not enough data', type: 'neutral' };
    }

    // Group expenses by month
    const monthlyTotals = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
        return acc;
    }, {});

    const months = Object.keys(monthlyTotals).sort();
    const lastMonth = monthlyTotals[months[months.length - 1]];
    const previousMonth = monthlyTotals[months[months.length - 2]];

    const change = ((lastMonth - previousMonth) / previousMonth) * 100;

    if (change < -10) {
        return { message: `↓ ${Math.abs(change).toFixed(1)}% decrease`, type: 'positive' };
    } else if (change > 10) {
        return { message: `↑ ${change.toFixed(1)}% increase`, type: 'negative' };
    } else {
        return { message: '≈ Stable spending', type: 'neutral' };
    }
}

function updateBudgetProgress() {
    const budget = parseFloat(localStorage.getItem('budget')) || 0;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = (totalExpenses / budget) * 100;

    const progressBar = document.getElementById('budget-progress');
    progressBar.style.width = `${Math.min(percentage, 100)}%`;
    progressBar.className = `progress ${percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : 'success'}`;
}

function generateAIInsights() {
    const insights = analyzeExpensePatterns();
    const insightsContainer = document.getElementById('ai-insights');
    
    insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-item ${insight.type}">
            <i class="fas ${insight.icon}"></i>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

function analyzeExpensePatterns() {
    const insights = [];
    
    // Analyze category distribution
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    // Generate insights based on category totals
    for (const [category, amount] of Object.entries(categoryTotals)) {
        const percentage = (amount / totalExpenses) * 100;
        insights.push({
            title: `Spending in ${category}`,
            description: `${percentage.toFixed(1)}% of total expenses.`,
            type: 'info', // You can change this to categorize insights
            icon: 'fa-chart-pie' // Example icon class, adjust as necessary
        });
    }

    return insights;
}

