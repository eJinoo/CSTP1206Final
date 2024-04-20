const express = require('express');
const Router = express.Router();
const ExpenseController = require('../controllers/expense');

// add expense
Router.post('/', ExpenseController.CreateExpense)

// show month expenses
Router.get('/', ExpenseController.MonthlyExpenses);

// delete expense
Router.delete('/:expenseId', ExpenseController.DeleteExpense);

module.exports = Router;