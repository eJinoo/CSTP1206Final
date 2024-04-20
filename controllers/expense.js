const ExpenseSchema = require('../models/expense');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const MonthlyExpenses = async (req, res) => {

    try {
        const expenses = await ExpenseSchema.find();
        return res.status(200).json({
            message: 'Expenses Found!',
            data: expenses
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching Expenses!',
            error
        })
    }
}

const CreateExpense = async (req, res) => {
    const allHeaders = req.headers;

    if (!allHeaders.authorization) {
        return res.status(401).json({
            message: "Please provide the token"
        })
    }
    const token = allHeaders.authorization;

    const decodedToken = jwt.decode(token, { complete: true});
    
    const userId = decodedToken.payload.id;

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
        return res.status(401).json({
            message: 'You are not authorized to create an Expense!'
        })
    }

    const ExpenseBody = req.body;

    const newExpense = new ExpenseSchema({
        title: ExpenseBody.title,
        category: ExpenseBody.category,
        expense: ExpenseBody.expense,
        date: ExpenseBody.date,
        user: userId
        
    })

    const savedExpense = await newExpense.save();

    return res.status(201).json({
        message: "Expense Created!",
        data: savedExpense
    })
    

}

const DeleteExpense = async (req, res) => {
    const allHeaders = req.headers;

    if (!allHeaders.authorization) {
        return res.status(401).json({
            message: "Please provide the token"
        });
    }

    const token = allHeaders.authorization;

    const decodedToken = jwt.decode(token, { complete: true });

    const userId = decodedToken.payload.id;

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
        return res.status(401).json({
            message: 'You are not authorized to delete an expense'
        });
    }

    const expenseId = req.params.expenseId; 

    try {
        const deletedExpense = await ExpenseSchema.findOneAndDelete({ _id: expenseId, user: userId });

        if (!deletedExpense) {
            return res.status(404).json({
                message: 'Expense not found or you are not authorized to delete it'
            });
        }

        return res.status(200).json({
            message: "Expense Deleted Successfully",
            data: deletedExpense
        });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({
            message: 'Error deleting the expense'
        });
    }
};

const generateAllExpenses = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        const userId = decodedToken.userId;

        const expenses = await ExpenseSchema.find({ user: userId });

        return res.status(200).json(expenses);

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = {
    MonthlyExpenses,
    CreateExpense,
    DeleteExpense,
    generateAllExpenses
}