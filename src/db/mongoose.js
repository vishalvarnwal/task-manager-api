const mongoose = require('mongoose')
//const validator = require('validator')

const url = process.env.MONGODB_URL

mongoose.connect(url, { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
})

//defining model
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         lowercase: true,
//         trim: true,
//         validate(value) {
//             if(!validator.isEmail(value)){
//                 console.log(validator.isEmail(value))
//                 throw new Error("Please enter valid email id")
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0){
//                 throw new Error("Please add positive age");
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minLength: 7,
//         validate(value) {
//             if(value.toLoweCase().includes("password")) {
//                 throw new Error("Password cannot contain password")
//             }
//         }
//     }
// })

// //creating new instance for user
// const me = new User({
//     name: '   Vishal Kumar',
//     email: '  MYEMAIL@MEAD.IO',
//     password: '  passwordfkfjrty'
// })

// //saving in db
// me.save().then((result)=>{
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })


//task script --------------------------------

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const myTask = new Task({
//     description: 'Drawing',
//     completed: true

// })

// myTask.save().then(() => {
//     console.log(myTask)
// }).catch((error) => {
//     console.log(error)
// })