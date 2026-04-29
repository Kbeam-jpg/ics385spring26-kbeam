import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // 2^13 rounds
// 10 => basically instant ~0.1s ~ 1k rounds
// 15 => like a second or so ~1s ~ 32k rounds
// 16 => still reasonable ~2s ~ 64k rounds
// 20 => way too long ~1.5 mins ~ 1mil rounds

/**
 * - email: * R U   | String  | toLowerCase()
 * - password: R  | String
 * - role: R      | String  | check in 'user','admin' | default = 'user'
 * - createdAt:   | Date    | default: now
 */
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    createdAt: {type: Date, default: Date.now}
});

/**
 * hash the password before storing
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // skip if not changed? still don't know what this line does
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next()
});

/**
 * 
 * @param {*} candidate 
 * @returns {Promise<Boolean>}
 */
userSchema.methods.comparePassword = function(candidate) {
    return bcrypt.compare(candidate, this.password);
}

export default mongoose.model('User', userSchema);