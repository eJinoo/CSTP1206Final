let expenseList = [];

function checkIfUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'https://cstp1206final-myqb.onrender.com';
    }
}

async function getAllExpenses() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in local storage');
        }

        const allExpenses = await fetch("/api/v1/user/expenses");

        const allExpensesJson = await allExpenses.json();
        expenseList = allExpensesJson.data;

        console.log(expenseList);
        generateAllExpenses(expenseList, userId);
    } catch(error) {
        alert('There was an err!')
    }
}

async function generateAllExpenses(expenseList, userId) {
    const ExpenseElements = document.getElementById('allExpenses');
    ExpenseElements.innerHTML = "";

    console.log(expenseList);

    for (let expense of expenseList) {  
        if (expense.user === userId){
        const expenseItem = `
        <li class="py-3 sm:py-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src=${categoryPicture(expense.category)}>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            ${expense.title}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            ${expense.date}
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $${expense.expense}
                    </div>
                    <button type="button" onclick="deleteExpense('${expense._id}')" class="space-x-0.5 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    <svg class="w-1 h-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                    <span class="sr-only">Icon description</span>
                    </button>
                </div>
            </li>
        `
        ExpenseElements.innerHTML += expenseItem;
        }  
    }
    
}

async function createExpense(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const expense = document.getElementById('cost').value;
    const category = document.getElementById('category').value;

    const ExpenseData = {
        title,
        date,
        expense,
        category
    }

    console.log(ExpenseData);

    const token = localStorage.getItem('token');

    if (!token) {
        alert("TOKEN NOT FOUND!");
        return;
    }

    try {
        const createdExpense = await fetch('/api/v1/user/expenses', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(ExpenseData)
        });

        const createdExpenseJSON = await createdExpense.json();

        if (createdExpenseJSON) {
            console.log(createdExpenseJSON.message);
        }
    } catch(error) {
        alert('There was an err!')
    }

    getAllExpenses();
}

async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        const expenseToDelete = await fetch(`/api/v1/user/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            }
        });
        console.log(expenseToDelete);

        if (expenseToDelete) {
            const deletedExpense = await expenseToDelete.json();
            console.log('Expense deleted successfully:', deletedExpense);
            getAllExpenses();
            getMonthExpenses();

        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userId')
    window.location.href = 'https://cstp1206final-myqb.onrender.com';
}

function categoryPicture(category){
    switch (category) {
        case "Food":
            return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        case "Fun":
            return 'https://images.unsplash.com/photo-1550850395-c17a8e90ad0a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        case "Bills":
            return 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        case "Car":
            return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        default:
            return 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
}

function checkMonth(){
    const month = document.getElementById('month');
    const monthTitle = document.getElementById('monthTitle');
    monthTitle.innerHTML = month.value;
    month.addEventListener('change', function() {
        monthTitle.innerHTML = month.value;     
    });
}

async function getMonthExpenses() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in local storage');
        }

        const allExpenses = await fetch("/api/v1/user/expenses");

        const allExpensesJson = await allExpenses.json();
        expenseList = allExpensesJson.data;

        console.log(expenseList);
        await generateMonthExpenses(expenseList, userId);
    } catch(error) {
        alert('There was an err!')
    }
}

async function generateMonthExpenses(expenseList, userId) {
    const ExpenseElements = document.getElementById('monthExpenses');
    const monthTotalElement = document.getElementById('monthTotal');
    const month = document.getElementById('month');
    let monthChanged = '';
    let monthTotal = 0;
    monthChanged = month.value;
    month.addEventListener('change', async function() {
        monthChanged = month.value;
        await getMonthExpenses();
        console.log(monthChanged)
    });

    ExpenseElements.innerHTML = "";
    monthTotalElement.innerHTML = "";

    console.log(month, ExpenseElements);

    for (let expense of expenseList) { 
        console.log(expense.date);
        let expenseMonth = await extractMonthNumber(expense.date);
        let monthTitle = await monthNameToNumber(monthChanged);
        if (expenseMonth === monthTitle && expense.user === userId){
        monthTotal += parseFloat(expense.expense);
        const expenseItem = `
        <li class="py-3 sm:py-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src=${categoryPicture(expense.category)}>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            ${expense.title}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            ${expense.date}
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $${expense.expense}
                    </div>
                </div>
            </li>
        `
        ExpenseElements.innerHTML += expenseItem;
        }  
    }
    monthTotalElement.innerHTML = `$${monthTotal}`;
    
}

function monthNameToNumber(monthName) {
    const months = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12"
    };
    const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    return months[formattedMonthName] || -1;
}

function extractMonthNumber(dateString) {
    const parts = dateString.split("/");
    const monthNumber = parts[0];
    return monthNumber;
}

checkIfUserLoggedIn();
getAllExpenses();
checkMonth();
getMonthExpenses();