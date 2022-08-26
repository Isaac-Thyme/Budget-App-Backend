'use strict';

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const budgetSchema = new Schema({
    budgetName: { type: String, required: true },
    monthlyIncome: { type: Number, required: false },
    monthlyLivingExpenses: { type: Number, required: false },
    additionalExpenses: { type: Number, required: false },
    personalSavings: { type: Number, required: false },
    retirementSavings: { type: Number, required: false }
});

const Budget = model('Budget', budgetSchema);

module.exports = Budget;