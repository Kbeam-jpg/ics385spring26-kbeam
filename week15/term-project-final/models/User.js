import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // 2^12 rounds
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
    // displayName is optional for local accounts; if missing we'll derive one from the email
    displayName: {type: String},
    password: {
        type: String,
        required: function requiredPassword() {
            return !this.googleId;
        } // false when googleId exists, true otherwise
    },
    googleId: {type: String, unique: true, sparse: true, index: true},
    provider: {type: String, enum: ['local', 'google'], default: 'local'},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    createdAt: {type: Date, default: Date.now}
});

/**
 * hash the password before storing
 */
userSchema.pre('save', async function() {
    // If displayName is missing, derive from email
    if (!this.displayName && this.email) {
        try {
            this.displayName = this.email.split('@')[0];
        } catch (e) {
            console.log("models/user error", e);
            // ignore and leave displayName undefined
        }
    }

    // hash the password before storing
    if (!this.password || !this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
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