/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 14 - Assignment 14b - Web App with Username/Pwd Security
GOAL: add an admin user (that's not publically accessible)
FILENAME: seed-admin.js
DATE: 4/22/2026
*/

import mongoose from 'mongoose';
import User from './models/user.js';
import 'dotenv/config';

// Store these in .env so they are hidden
await mongoose.connect(process.env.MONGO_URI);
const __email = process.env.SEED_ADMIN_EMAIL;
const __password = process.env.SEED_ADMIN_PSWD;

// just make a user
// the pre hook will correctly hash the password
await User.insertOne({
    email: __email,
    password: __password,
    role: 'admin',
});

console.log(`
    Successfully created Admin user:
    email: ${__email}
    password: = ${__password}
    `);
await mongoose.disconnect();