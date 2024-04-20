const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT =  process.env.PORT || 4000;
require('dotenv').config();

const UserRoutes = require('./routes/user');
const ExpenseRoutes = require('./routes/expense');

const path = require('path');

app.use(express.json());

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.error(`Error connecting to the database: ${error}`);
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/blog/v1/users', UserRoutes);
app.use('/api/v1/user/expenses', ExpenseRoutes);

app.listen(PORT, () => {
    console.log(`Server Running at port ${PORT}`);
})