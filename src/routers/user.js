const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeMail, sendGoodByeMail} = require('../emails/account')




/*when not using async function and dependent on promise chaining*/

// app.post('/users', (req, res) => {
//     const user = new User(req.body)

//     user.save().then(() => {
//         res.send(user)
//     }).catch((error) => {
//         res.status(400).send(error)
//     })
// })


/*when using sync funciton*/

router.post('/users', async (req, res) => {    //Here async function also returns promise but express doesn't care about what funciton
    const user = new User(req.body)         //is returning, it works on req and res. 
    try{       
        await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({ user, token })
    }catch(e) {
        res.status(400).send("Please login with correct credentials")
    }  
})

router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send("Successfully logout")

    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send("Logged out from all active sessions!")
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

router.get('/users', auth, async (req,res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"})
    }

    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    //const _id = req.user._id

    try{
        //const user = await User.findByIdAndDelete(_id)
        await req.user.remove()
        sendGoodByeMail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e) {
        res.status(500).send(e)
    }    
})

const upload = multer({
//    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("please upload your profile in a correct format"))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router