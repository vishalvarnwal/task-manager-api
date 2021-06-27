const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('./db/mongoose')   //it will run the mongoose.js file so mongoose.connect will execut and will be connected to mongodb
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())     //to convert json data into object form
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port '+port)
})













// //multer is used to upload the image but in form-data format not it json
// const multer = require('multer')

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     }, 
//     fileFilter(req, file, cb){        //cb - callback
//         //if(!file.originalname.endsWith('.pdf')){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('please upload a doc/docx file'))
//         }
//         cb(undefined, true)
//         // cb(new Error("files must be a pdf"))                //if its error
//         // cb(undefined, true)             // if no error and file is uploaded 
//         // cb(udefined, fasle)             // if no error and file is not uploaded
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(404).send({error: error.message})
// })




// //how to know the user profile by having task, obtaining user details from task (creating relation between two models)

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     const task = await Task.findById('60ccf4d6c4178f257c13cbbf')
//     await task.populate('owner').execPopulate()  //populate allows us to populate data from relationship such as data we have owner
//     //above line is gonna find the user which is associatied with this task and task.owner will now be there profile, the entire document
//     console.log(task.owner)

//     //getting task from user profile (reverse direction)
//     const user = await User.findById('60ccf408c4178f257c13cbbd')
//     await user.populate('userTasks').execPopulate()
//     console.log(user.userTasks)
// }

// main()

//using express middleware, explanation below
/*
Express middleware - 
without middleware: new request -> run route handler

with middleware: new request -> do something -> run route handler
*/


// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('GET request are disabled')
//     }else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send("Site is Under maintenance, Check back soon")
// })



/*
JSON web token (jwt) - it's used to create token to authenticate user to perform any operation. Means a user can perform any task
which he/she would have created.

sign method - used to create token, it's return value is a new token.
JWT token is made of three distinct part separated by two periods
1st part is base 64 encoded json string called as header which contain some meta information about what type of token it is.
2nd part is payload or body, this is also a base 64 encoded json string and this contain the data what we provided, in our eg is _id.
3rd part is signatiure and this is used to verify the token  

verify method - used to verify the token, it accepts argument as token and secret string passed to create the token.

// const myFunction = () => {
//     const token = jwt.sign({_id: "1234@"}, "heyFriend", {expiresIn: '7 days'})  //two arguments one is object another is secrets string
//     console.log(token)

//     const match = jwt.verify(token, "heyFriend")
//     console.log(match)
// }

// myFunction()
*/


/*
bcyptjs - it's npm library used to hasing the password.

Hasging - For security reasons, you may want to store passwords in hashed form. This guards against the possibility that 
someone who gains unauthorized access to the database can retrieve the passwords of every user in the system. Hashing performs 
a one-way transformation on a password, turning the password into another String, called the hashed password. “One-way” means 
that it is practically impossible to go the other way - to turn the hashed password back into the original password. There are 
several mathematically complex hashing algorithms that fulfill these needs. In node js mostly bcrpytjs npm helps to hash the 
password

Hashing method returns promise.

// const hasingPassword = async () => {
//     const password = 'vishal123'
//     const hashPassword = await bcrypt.hash(password, 8)
//     isMatch = await bcrypt.compare('vishal123', hashPassword)
//     console.log(password)
//     console.log(hashPassword)
//     console.log(isMatch)
// }

// hasingPassword()
*/


/*
when ever you called json.strigify and if you use a function toJSON with that object automatically before calling stringyfy
method, toJSON function will be called and return value of this function will be the argument of json.stringyfy

const pet = {
    name: "ROBBY"
}

pet.toJSON = function() {
    console.log(this)
    return this
   // return {}
}
console.log(JSON.stringify(pet))

*/