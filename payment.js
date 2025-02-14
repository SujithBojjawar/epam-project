let walletBalance = 10000;
const transactions = [];

function showModal(type) {
    const modal = document.getElementById(`${type}MoneyModal`);
    modal.style.display = 'flex';
}

function hideModal(type) {
    const modal = document.getElementById(`${type}MoneyModal`);
    modal.style.display = 'none';
}

function updateBalance() {
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = walletBalance.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    balanceElement.classList.add('success-animation');
    setTimeout(() => {
        balanceElement.classList.remove('success-animation');
    }, 500);
}

function addTransaction(type, amount, description) {
    const transaction = {
        type,
        amount,
        description,
        timestamp: new Date(),
        id: Math.random().toString(36).substr(2, 9)
    };
    transactions.unshift(transaction);
    updateTransactionsList();
}

function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon">${transaction.type === 'credit' ? '+' : '-'}</div>
                <div>
                    <div>${transaction.description}</div>
                    <small>${transaction.timestamp.toLocaleString()}</small>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </div>
        </div>
    `).join('');
}

function addMoney() {
    const amount = parseFloat(document.getElementById('addAmount').value);
    if (amount > 0) {
        walletBalance += amount;
        addTransaction('credit', amount, 'Added to wallet');
        updateBalance();
        hideModal('add');
    } else {
        alert('Please enter a valid amount.');
    }
}

function sendMoney() {
    const recipientId = document.getElementById('recipientId').value;
    const amount = parseFloat(document.getElementById('sendAmount').value);
    if (recipientId && amount > 0 && amount <= walletBalance) {
        walletBalance -= amount;
        addTransaction('debit', amount, `Sent to ${recipientId}`);
        updateBalance();
        hideModal('send');
    } else {
        alert('Please enter valid details and ensure you have sufficient balance.');
    }
}

window.onload = () => {
    updateBalance();
    updateTransactionsList();
};
