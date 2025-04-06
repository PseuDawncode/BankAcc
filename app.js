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

// login section functionality
document.getElementById("loginBtn").addEventListener("click", function() {
    const accountName = document.getElementById("accountName").value.trim();
    const accountNumber = document.getElementById("accountNumber").value.trim();
    
    if (!accountName || !accountNumber) {
        alert("Please enter valid account name and valid number.");
        return;
    }
    
    // user account validation
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
        
        // clear input fields
        document.getElementById("accountName").value = "";
        document.getElementById("accountNumber").value = "";
        
        // load transaction history
        loadTransactionHistory();
    } else {
        // create new account
        if (confirm("Account not found! Pleas enter a valid account")) {
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

// initialize transaction arrays if they don't exist
accounts.forEach(account => {
    if (!account.transactions) {
        account.transactions = [];
    }
});

// deposit functionality
document.getElementById("depositBtn").addEventListener("click", function() {
    transactionType = "deposit";
    document.getElementById("transactionAmount").value = "";
    transactionForm.classList.remove("hidden");
});

// withdraw functionality
document.getElementById("withdrawBtn").addEventListener("click", function() {
    transactionType = "withdraw";
    document.getElementById("transactionAmount").value = "";
    transactionForm.classList.remove("hidden");
});

// confirm transaction
document.getElementById("confirmTransactionBtn").addEventListener("click", function() {
    const amountInput = document.getElementById("transactionAmount");
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    
    if (transactionType === "deposit") {
        currentUser.balance += amount;
        
        // transaction history functionality
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
        
        // add to transaction history
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

// logout functionality
document.getElementById("logoutBtn").addEventListener("click", function() {
    currentUser = null;
    accountSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    historyList.innerHTML = "";
});

// update UI
function updateUI() {
    balanceAmount.textContent = currentUser.balance.toFixed(2);
    loadTransactionHistory();
}

// load transaction history
function loadTransactionHistory() {
    historyList.innerHTML = "";
    
    if (!currentUser.transactions || currentUser.transactions.length === 0) {
        historyList.innerHTML = "<p style='text-align: center; color: #6b7280;'>No transactions yet</p>";
        return;
    }
    
    // sort transactions by date
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