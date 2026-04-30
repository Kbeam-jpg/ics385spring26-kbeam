/*
# Name: Kendall Beam
# Assignment: HW15a
# Description: MongoDB schema for storing user data
# Filename: User.js
# Date: 4/30/26 
*/

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {type: String, required: true, unique: true},
    email: {type: String, required: true, lowercase: true},
    displayName: {type: String, required: true},
    provider: {type: String, default: 'google'},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('User', userSchema);