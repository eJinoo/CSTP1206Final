const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  expense: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
    required: true
}
}, {
    timestamps: true
});


const ExpenseModel = mongoose.model('UserExpense', ExpenseSchema);

module.exports = ExpenseModel;