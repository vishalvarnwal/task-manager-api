const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

/*
hashing of password will be performed here using middleware
middleware is function which can be executed before or after the execution of asynchronous function.
middleware has four types document middleware, model middleware, aggregate middleware, and query middleware.
Document middleware is supported for the following document functions. In document middleware functions, this 
refers to the document.
    validate
    save --- we are performing in save for hashing the password
    remove
    upda9teOne
    deleteOne
*/


//defining schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                console.log(validator.isEmail(value))
                throw new Error("Please enter valid email id")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error("Please add positive age");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain password")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//creating a virtual relationship from user to task so we can access the tasks from userprofile easily by relationship
userSchema.virtual('userTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


//mehtods are accessible in the instances, sometime called instance method
userSchema.methods.generateAuthToken =  async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()    // toObject method given by mongoose which converts the mongoose document into a plain JavaScript object

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

/*
Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.
Statics methods are accessible on model, sometime called as model methods
we are setting that up as something we can access directly on the model once we actually have the access to it.
*/
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email})
    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }
    return user
}


/*applied middleware in schema, note schema takes two arguments 
    1st - document method function (save/remove/update/delete etc)
    2nd - it takes function.

    note - middleware access the document using this and since this is not binded with arrow function hence we are using
    normal funtion method. this funciton has one argument "next" which we have to call at the end of the middleware function
    this next function calling will indicate that our middleware operation is over now and can be permofrmed next step. if 
    it wouldn't be called then at the end of the middleware step execution will get hanged and and db operation will not be 
    happening.
*/
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

//deleting usertasks when the user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User