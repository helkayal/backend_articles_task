const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(val) {
            let password = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])');
            if (!password.test(val)) {
                throw new Error('Password must include uppercase, lowercase, number and special character')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(val) {
            if (val < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    city: {
        type: String,
    },
    tokens: [
        {
            type: String,
            required: true
        }
    ]
})

userSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
})

////login
userSchema.statics.findByCredentials = async (un, pass) => {
    // console.log('model - findByCredentials');
    // console.log(un);
    const user = await User.findOne({ username: un });
    // console.log(user);
    if (!user) {
        throw new Error('Unable to login');
    }
    // console.log(pass);
    // console.log(user.password);
    const isMatch = await bcryptjs.compare(pass, user.password);
    // console.log(isMatch);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'elkayal2024');
    user.tokens = user.tokens.concat(token);
    await user.save();
    return token;
}

///hide private data
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

const User = mongoose.model('User', userSchema);

module.exports = User