'use strict';

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    // token: { type: String, required: true },
    budget: [{ type: Schema.Types.String, ref: 'Budget' }]
});

const Users = model('Users', userSchema);

module.exports = Users;
