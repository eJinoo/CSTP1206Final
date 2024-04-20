const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: function() {
        return new mongoose.Types.ObjectId();
      },
      unique: true,
      required: true,
    }
  }, {
      timestamps: true
  });

const UserModel = mongoose.model('ExpenseUser', UserSchema);

module.exports = UserModel;
