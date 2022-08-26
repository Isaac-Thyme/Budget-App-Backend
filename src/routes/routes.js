'use strict';

// Third party/ENV imports
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/auth.js');

// Esoteric imports
const Users = require('../schema/Users.js');
const Budget = require('../schema/Budget.js');

const routeObject = {};

routeObject.signup = async function (req, res) {
    let alreadyExists = await Users.find({ email: req.body.email });
    if (alreadyExists.length === 0) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        let user = await Users.create(req.body);
        const token = signToken(user);
        res.json({ user, token });
    } else {
        res.status(500).send("A user with that email already exists.");
    }
}

routeObject.login = async function (req, res) {
    let user = await Users.findOne({ username: req.body.username });
    if (user) {
        let flag = await bcrypt.compare(req.body.password, user.password);
        if (flag) {
            const token = signToken(user);
            res.status(202).send({ user, token });
        } else {
            res.status(404).send('Incorrect credentials provided.');
        }
    } else {
        res.status(404).send('Incorrect credentials provided.');
    }
}

routeObject.budget = async function (req, res) {
    try {
        let existingBudget = await Budget.findOne({ budgetName: req.body.budgetName });
        if (existingBudget) {
            res.status(500).send('Budget name already exists.');
        } else {
            let u = await Users.findOne({ username: req.username });
            let temp = {};
            temp.budgetName = req.body.budgetName;
            temp.monthlyIncome = req.body.monthlyIncome || 0;
            temp.monthlyLivingExpenses = req.body.monthlyLivingExpenses || 0;
            temp.additionalExpenses = req.body.additionalExpenses || 0;
            temp.personalSavings = req.body.personalSavings || 0;
            temp.retirementSavings = req.body.retirementSavings || 0;
            let createdBudget = await Budget.create(temp);
            u.budget.push(createdBudget.budgetName);
            u.save();
            res.status(201).send(u);
        }
    } catch {
        res.status(500).send('Incorrect credentials.')
    }
}

routeObject.getBudget = async function (req, res) {
    try {
        let budget = await Budget.findOne({ budgetName: req.query.budgetName });
        res.status(200).send(budget);
    } catch {
        res.status(400).send('Budget not found')
    }
}

routeObject.editExpenses = async function (req, res) {
    try {
        let foundBudget = await Budget.findOne({ budgetName: req.body.budgetName });
        let newExpenses = foundBudget.additionalExpenses + parseInt(req.body.additionalExpenses);
        let budget = await Budget.findOneAndUpdate({ budgetName: req.body.budgetName }, { additionalExpenses: newExpenses }, { new: true });
        res.status(200).send(budget);
    } catch {
        res.status(400).send('Budget not found');
    }
}

routeObject.editBudget = async function (req, res) {
    try {
        let budget = await Budget.findOneAndUpdate(
            { budgetName: req.body.budgetName },
            {
                monthlyIncome: req.body.monthlyIncome,
                monthlyLivingExpenses: req.body.monthlyLivingExpenses,
                additionalExpenses: req.body.additionalExpenses,
                personalSavings: req.body.personalSavings,
                retirementSavings: req.body.retirementSavings,
            },
            { new: true });
        res.status(200).send(budget);
    } catch {
        res.status(400).send('Budget not found');
    }
}

module.exports = routeObject;
