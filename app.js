// user account
const accounts = [
    { name: "Mary Dawn", number: "123-444-888", balance: 1000 },
    { name: "Alf David", number: "2301-8880", balance: 2500 }
];

// elements
const loginSection = document.getElementById("loginSection");
const accountSection = document.getElementById("accountSection");
const userNameDisplay = document.getElementById("userNameDisplay");
const balanceAmount = document.getElementById("balanceAmount");
const historyList = document.getElementById("historyList");
const transactionForm = document.getElementById("transactionForm");

let currentUser = null;
let transactionType = null;

// Login functionality
document.getElementById("loginBtn").addEventListener("click", function() {
    const accountName = document.getElementById("accountName").value.trim();
    const accountNumber = document.getElementById("accountNumber").value.trim();
    
    if (!accountName || !accountNumber) {
        alert("Please enter both account name and number.");
        return;
    }
    
    // Check if account exists
    const user = accounts.find(acc => 
        acc.name.toLowerCase() === accountName.toLowerCase() && 
        acc.number === accountNumber
    );
    
    if (user) {
        currentUser = user;
        userNameDisplay.textContent = user.name;
        balanceAmount.textContent = user.balance.toFixed(2);
        loginSection.classList.add("hidden");
        accountSection.classList.remove("hidden");
        
        // Clear input fields
        document.getElementById("accountName").value = "";
        document.getElementById("accountNumber").value = "";
        
        // Load transaction history
        loadTransactionHistory();
    } else {
        // Create new account if it doesn't exist
        if (confirm("Account not found. Would you like to create a new account?")) {
            const newUser = {
                name: accountName,
                number: accountNumber,
                balance: 0,
                transactions: []
            };
            accounts.push(newUser);
            currentUser = newUser;
            userNameDisplay.textContent = newUser.name;
            balanceAmount.textContent = newUser.balance.toFixed(2);
            loginSection.classList.add("hidden");
            accountSection.classList.remove("hidden");
        }
    }
});

// Initialize transaction arrays if they don't exist
accounts.forEach(account => {
    if (!account.transactions) {
        account.transactions = [];
    }
});

// Deposit button click
document.getElementById("depositBtn").addEventListener("click", function() {
    transactionType = "deposit";
    document.getElementById("transactionAmount").value = "";
    transactionForm.classList.remove("hidden");
});

// Withdraw button click
document.getElementById("withdrawBtn").addEventListener("click", function() {
    transactionType = "withdraw";
    document.getElementById("transactionAmount").value = "";
    transactionForm.classList.remove("hidden");
});

// Confirm transaction
document.getElementById("confirmTransactionBtn").addEventListener("click", function() {
    const amountInput = document.getElementById("transactionAmount");
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    
    if (transactionType === "deposit") {
        currentUser.balance += amount;
        
        // Add to transaction history
        currentUser.transactions = currentUser.transactions || [];
        currentUser.transactions.push({
            type: "deposit",
            amount: amount,
            date: new Date()
        });
        
        updateUI();
        alert(`Successfully deposited $${amount.toFixed(2)}`);
    } else if (transactionType === "withdraw") {
        if (amount > currentUser.balance) {
            alert("Insufficient funds.");
            return;
        }
        
        currentUser.balance -= amount;
        
        // Add to transaction history
        currentUser.transactions = currentUser.transactions || [];
        currentUser.transactions.push({
            type: "withdraw",
            amount: amount,
            date: new Date()
        });
        
        updateUI();
        alert(`Successfully withdrew $${amount.toFixed(2)}`);
    }
    
    transactionForm.classList.add("hidden");
    amountInput.value = "";
});

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", function() {
    currentUser = null;
    accountSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    historyList.innerHTML = "";
});

// Update UI
function updateUI() {
    balanceAmount.textContent = currentUser.balance.toFixed(2);
    loadTransactionHistory();
}

// Load transaction history
function loadTransactionHistory() {
    historyList.innerHTML = "";
    
    if (!currentUser.transactions || currentUser.transactions.length === 0) {
        historyList.innerHTML = "<p style='text-align: center; color: #6b7280;'>No transactions yet</p>";
        return;
    }
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...currentUser.transactions].reverse();
    
    sortedTransactions.forEach(transaction => {
        const item = document.createElement("div");
        item.className = "history-item";
        
        const dateStr = new Date(transaction.date).toLocaleString();
        
        if (transaction.type === "deposit") {
            item.innerHTML = `
                <span>${dateStr}</span>
                <span class="deposit">+$${transaction.amount.toFixed(2)}</span>
            `;
        } else {
            item.innerHTML = `
                <span>${dateStr}</span>
                <span class="withdraw">-$${transaction.amount.toFixed(2)}</span>
            `;
        }
        
        historyList.appendChild(item);
    });
}